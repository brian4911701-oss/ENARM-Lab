(function initEnarmSecurityCrypto(root) {
    "use strict";

    const toBase64 = (bytes) => {
        let binary = "";
        const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
        for (let offset = 0; offset < view.length; offset += 0x8000) {
            binary += String.fromCharCode(...view.subarray(offset, offset + 0x8000));
        }
        return btoa(binary);
    };

    const pemToArrayBuffer = (pem) => {
        const base64 = String(pem || "")
            .replace(/-----BEGIN PUBLIC KEY-----/g, "")
            .replace(/-----END PUBLIC KEY-----/g, "")
            .replace(/\s+/g, "");
        if (!base64) throw new Error("withdrawal_public_key_missing");
        const binary = atob(base64);
        return Uint8Array.from(binary, char => char.charCodeAt(0)).buffer;
    };

    const encryptWithdrawalDetails = async (details) => {
        if (!root.crypto?.subtle) throw new Error("web_crypto_unavailable");
        const publicKeyPem = root.ENARM_WITHDRAWAL_PUBLIC_KEY_PEM;
        const publicKey = await root.crypto.subtle.importKey(
            "spki",
            pemToArrayBuffer(publicKeyPem),
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ["encrypt"]
        );
        const dataKey = await root.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt"]
        );
        const iv = root.crypto.getRandomValues(new Uint8Array(12));
        const plaintext = new TextEncoder().encode(JSON.stringify(details));
        const ciphertext = await root.crypto.subtle.encrypt({ name: "AES-GCM", iv }, dataKey, plaintext);
        const rawKey = await root.crypto.subtle.exportKey("raw", dataKey);
        const wrappedKey = await root.crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, rawKey);
        return Object.freeze({
            version: 1,
            algorithm: "RSA-OAEP-256+A256GCM",
            keyVersion: String(root.ENARM_WITHDRAWAL_KEY_VERSION || "2026-01"),
            wrappedKey: toBase64(wrappedKey),
            iv: toBase64(iv),
            ciphertext: toBase64(ciphertext)
        });
    };

    root.ENARMSecurityCrypto = Object.freeze({ encryptWithdrawalDetails });
})(window);
