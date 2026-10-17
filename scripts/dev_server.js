'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { files, directories } = require('./build_hosting');
const root = path.resolve(__dirname, '..');
const publicFiles = new Set(files);
const routes = {
    '/api/account-session': () => require('../api/account-session'),
    '/api/study-sync': () => require('../api/study-sync'),
    '/api/start-premium-trial': () => require('../api/start-premium-trial')
};
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
    '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon' };

function json(response, status, body) {
    response.statusCode = status;
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(body));
}

function configureCredentials() {
    require('dotenv').config({ path: path.join(root, '.env.local'), quiet: true });
    require('dotenv').config({ path: path.join(root, '.env'), quiet: true });
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const candidates = fs.readdirSync(root).filter(name => /firebase-adminsdk.*\.json$/i.test(name));
        const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
            || (candidates.length === 1 ? path.join(root, candidates[0]) : '');
        if (credentialPath) process.env.FIREBASE_SERVICE_ACCOUNT_JSON = fs.readFileSync(path.resolve(root, credentialPath), 'utf8');
    }
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        throw new Error('Configura GOOGLE_APPLICATION_CREDENTIALS con la ruta del JSON privado de Firebase en .env.local.');
    }
    // Validate locally before accepting logins; never send this credential to the browser.
    const credential = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    require('firebase-admin').credential.cert(credential);
    return credential.project_id;
}

function createDevServer({ handlers = routes } = {}) {
    return http.createServer(async (request, response) => {
        response.setHeader('Cache-Control', 'no-store');
        response.setHeader('X-Content-Type-Options', 'nosniff');
        try {
            const host = request.headers.host;
            if (!host || !['127.0.0.1', 'localhost'].includes(new URL('http://' + host).hostname)) {
                return json(response, 403, { code: 'local-host-required' });
            }
            const origin = request.headers.origin;
            if (origin && origin !== 'http://' + host) return json(response, 403, { code: 'cross-origin-denied' });
            const pathname = decodeURIComponent(new URL(request.url, 'http://' + host).pathname);
            if (Object.hasOwn(handlers, pathname)) {
                // Match Vercel's request/response interface while preserving the real endpoint's authentication.
                response.status = status => { response.statusCode = status; return response; };
                response.json = body => json(response, response.statusCode, body);
                if (request.method === 'POST') {
                    let size = 0;
                    const chunks = [];
                    for await (const chunk of request) {
                        size += chunk.length;
                        if (size > 850000) return json(response, 413, { code: 'payload-too-large' });
                        chunks.push(chunk);
                    }
                    try { request.body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
                    catch { return json(response, 400, { code: 'invalid-request' }); }
                }
                return await handlers[pathname]()(request, response);
            }
            if (pathname.startsWith('/api/')) return json(response, 404, { code: 'not-found' });
            if (!['GET', 'HEAD'].includes(request.method)) {
                response.setHeader('Allow', 'GET, HEAD');
                return json(response, 405, { code: 'method-not-allowed' });
            }
            const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
            const segments = relative.split('/');
            if (relative.includes('\\') || segments.some(segment => !segment || segment.startsWith('.'))
                || (!publicFiles.has(relative) && !(directories.includes(segments[0]) && segments.length > 1))) {
                return json(response, 404, { code: 'not-found' });
            }
            const filename = path.join(root, ...segments);
            // Resolve symlinks too, so an asset folder cannot expose a file outside its public directory.
            const allowedRoot = directories.includes(segments[0]) ? path.join(root, segments[0]) : root;
            const resolved = await fs.promises.realpath(filename);
            const within = path.relative(allowedRoot, resolved);
            if (within.startsWith('..') || path.isAbsolute(within)) return json(response, 404, { code: 'not-found' });
            const stat = await fs.promises.stat(resolved);
            if (!stat.isFile()) return json(response, 404, { code: 'not-found' });
            const content = request.method === 'HEAD' ? null : await fs.promises.readFile(resolved);
            response.setHeader('Content-Type', types[path.extname(resolved).toLowerCase()] || 'application/octet-stream');
            response.setHeader('Content-Length', stat.size);
            response.end(content);
        } catch (error) {
            const status = ['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : error instanceof URIError ? 400 : 500;
            if (!response.headersSent) json(response, status, { code: status === 404 ? 'not-found' : 'local-server-error' });
            else response.destroy();
        }
    });
}

if (require.main === module) {
    try {
        const portFlag = process.argv.indexOf('--port');
        const port = Number(portFlag === -1 ? process.env.PORT || 5501 : process.argv[portFlag + 1]);
        if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Puerto inválido. Usa --port 5501.');
        const project = configureCredentials();
        const server = createDevServer();
        server.on('error', error => {
            console.error(error.code === 'EADDRINUSE'
                ? `El puerto ${port} está ocupado. Detén Live Server o usa npm run dev -- --port ${port + 1}.`
                : 'No se pudo iniciar el servidor local: ' + error.code);
            process.exitCode = 1;
        });
        server.listen(port, '127.0.0.1', () => {
            console.log(`ENARMAX local: http://127.0.0.1:${port}/`);
            console.log(`Firebase: ${project}. Los accesos y el progreso usan este proyecto real.`);
            console.log('Los cambios en HTML, CSS y JS se ven al recargar. Ctrl+C para detener.');
        });
    } catch {
        console.error('No se pudo cargar la credencial privada de Firebase. Revisa GOOGLE_APPLICATION_CREDENTIALS o FIREBASE_SERVICE_ACCOUNT_JSON en .env.local.');
        process.exitCode = 1;
    }
}

module.exports = { createDevServer, configureCredentials };
