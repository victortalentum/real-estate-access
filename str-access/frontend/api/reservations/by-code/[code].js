"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
var reservations_json_1 = require("../../../reservations.json");
function handler(req, res) {
    var code = req.query.code;
    var found = Array.isArray(reservations_json_1.default)
        ? reservations_json_1.default.find(function (r) { return r.code === code; })
        : null;
    if (!found)
        return res.status(404).json({ error: "Not found", code: code });
    return res.status(200).json(found);
}
