"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusPill = StatusPill;
var jsx_runtime_1 = require("react/jsx-runtime");
function StatusPill(_a) {
    var phase = _a.phase;
    var label = phase === "active" ? "Access active" : phase === "before" ? "Not active yet" : "Reservation ended";
    return ((0, jsx_runtime_1.jsxs)("div", { style: { display: "inline-flex", gap: 8, alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: phase === "active" ? "#2ecc71" : phase === "before" ? "#f1c40f" : "#95a5a6",
                    opacity: 0.9,
                } }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: 14, fontWeight: 600 }, children: label })] }));
}
