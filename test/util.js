//
// ── LOAD .ENV FILE ──────────────────────────────────────────────────────────────
//
require('dotenv').config()

//
// ─── EXPORT VARIABLES ───────────────────────────────────────────────────────────
//
exports.endpoint = process.env.ENDPOINT;
exports.request = process.env.REQUEST;
exports.secret = process.env.SECRET;