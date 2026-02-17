"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
function handler(req, res) {
    res.status(200).json({ pong: true, ts: new Date().toISOString() });
}
