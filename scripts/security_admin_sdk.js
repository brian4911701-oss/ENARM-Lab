"use strict";

function loadAdminSdk() {
  try {
    return require("firebase-admin");
  } catch (_rootError) {
    return require("../functions/node_modules/firebase-admin");
  }
}

function initializeAdmin() {
  const admin = loadAdminSdk();
  const projectId = process.env.GCLOUD_PROJECT
    || process.env.GOOGLE_CLOUD_PROJECT
    || "enarm-lab-social";
  if (!admin.apps.length) admin.initializeApp({ projectId });
  return { admin, projectId, db: admin.firestore(), auth: admin.auth() };
}

function requireServiceAccountHint() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      "Define GOOGLE_APPLICATION_CREDENTIALS con la ruta de la credencial administrativa privada."
    );
  }
}

module.exports = { initializeAdmin, requireServiceAccountHint };
