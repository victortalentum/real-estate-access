"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Countdown = Countdown;
var jsx_runtime_1 = require("react/jsx-runtime");
// frontend/src/components/Countdown.tsx
var time_1 = require("../utils/time");
function Countdown(_a) {
    var _b, _c;
    var target = _a.target, now = _a.now, label = _a.label;
    var t = (_b = target === null || target === void 0 ? void 0 : target.getTime) === null || _b === void 0 ? void 0 : _b.call(target);
    var n = (_c = now === null || now === void 0 ? void 0 : now.getTime) === null || _c === void 0 ? void 0 : _c.call(now);
    // Guard: si target/now no son Date válidos -> no pintes NaN
    if (!Number.isFinite(t) || !Number.isFinite(n)) {
        return ((0, jsx_runtime_1.jsxs)("div", { children: [label && (0, jsx_runtime_1.jsx)("div", { className: "muted small", children: label }), (0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 700 }, children: "\u2014" })] }));
    }
    var ms = Math.max(0, t - n);
    // Si ya pasó el tiempo, mostramos 0s en vez de NaN o negativo
    return ((0, jsx_runtime_1.jsxs)("div", { children: [label && (0, jsx_runtime_1.jsx)("div", { className: "muted small", children: label }), (0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 700 }, children: (0, time_1.formatDuration)(ms) })] }));
}
