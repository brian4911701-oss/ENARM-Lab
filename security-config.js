// Configuración pública de controles antiabuso. La site key de reCAPTCHA es pública;
// la llave privada de retiros se mantiene fuera del repositorio.
window.ENARM_SECURITY_CONFIG = Object.freeze({
    appCheckSiteKey: "",
    appCheckAutoRefresh: true
});
