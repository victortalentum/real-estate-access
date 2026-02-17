"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AccessPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
function AccessPage() {
    var _this = this;
    var reservationId = (0, react_1.useMemo)(function () {
        // /RES-123  -> "RES-123"
        var p = window.location.pathname.replace("/", "").trim();
        return p || "";
    }, []);
    var _a = (0, react_1.useState)(true), loading = _a[0], setLoading = _a[1];
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    var _c = (0, react_1.useState)(null), reservation = _c[0], setReservation = _c[1];
    (0, react_1.useEffect)(function () {
        if (!reservationId) {
            setError("Missing reservation code in URL (e.g., /RES-123).");
            setLoading(false);
            return;
        }
        var run = function () { return __awaiter(_this, void 0, void 0, function () {
            var r, contentType, text, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, 6, 7]);
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, fetch("/api/reservations/by-id/".concat(encodeURIComponent(reservationId)), {
                                headers: { "Accept": "application/json" }
                            })];
                    case 1:
                        r = _a.sent();
                        contentType = r.headers.get("content-type") || "";
                        if (!!contentType.includes("application/json")) return [3 /*break*/, 3];
                        return [4 /*yield*/, r.text()];
                    case 2:
                        text = _a.sent();
                        throw new Error("API returned non-JSON (".concat(r.status, "). Body: ").concat(text.slice(0, 120)));
                    case 3: return [4 /*yield*/, r.json()];
                    case 4:
                        data = _a.sent();
                        if (!r.ok || !(data === null || data === void 0 ? void 0 : data.ok)) {
                            throw new Error((data === null || data === void 0 ? void 0 : data.error) || "Request failed (".concat(r.status, ")"));
                        }
                        setReservation(data.reservation);
                        return [3 /*break*/, 7];
                    case 5:
                        e_1 = _a.sent();
                        setError((e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || "Unknown error");
                        return [3 /*break*/, 7];
                    case 6:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        run();
    }, [reservationId]);
    var onOpenDoor = function () {
        alert("✅ Demo: aquí irá la integración real (Hospitable/Butterfly/DoorBird).");
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.page, children: (0, jsx_runtime_1.jsxs)("div", { style: styles.container, children: [(0, jsx_runtime_1.jsxs)("div", { style: styles.header, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: styles.h1, children: "Access" }), (0, jsx_runtime_1.jsx)("div", { style: styles.sub, children: "Your entry details, ready on your phone." })] }), (0, jsx_runtime_1.jsx)("div", { style: styles.badge, children: "apartments-nyc.com" })] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.card, children: [loading && ((0, jsx_runtime_1.jsxs)("div", { style: styles.line, children: ["Loading reservation ", (0, jsx_runtime_1.jsx)("b", { children: reservationId }), "\u2026"] })), !loading && error && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { style: __assign(__assign({}, styles.line), { color: "#ffb4b4" }), children: [(0, jsx_runtime_1.jsx)("b", { children: "Error:" }), " ", error] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.small, children: ["Tip: open a valid link like ", (0, jsx_runtime_1.jsx)("b", { children: "/RES-123" }), " or ", (0, jsx_runtime_1.jsx)("b", { children: "/RES-456" }), "."] })] })), !loading && !error && reservation && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { style: styles.row, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.label, children: "Reservation" }), (0, jsx_runtime_1.jsx)("div", { style: styles.value, children: reservation.reservationId })] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.row, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.label, children: "Guest" }), (0, jsx_runtime_1.jsx)("div", { style: styles.value, children: reservation.name })] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.row, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.label, children: "Property" }), (0, jsx_runtime_1.jsx)("div", { style: styles.value, children: reservation.property })] }), (0, jsx_runtime_1.jsx)("button", { style: styles.cta, onClick: onOpenDoor, children: "Open door" }), (0, jsx_runtime_1.jsx)("div", { style: styles.small, children: "Next: connect this button to Hospitable actions + your lock provider." })] }))] }), (0, jsx_runtime_1.jsx)("div", { style: styles.footer, children: "If you need help, reply to your confirmation message with \u201Chelp\u201D." })] }) }));
}
var styles = {
    page: {
        minHeight: "100vh",
        background: "radial-gradient(1200px 600px at 10% 0%, rgba(255,255,255,0.08), transparent), #0b0b0f",
        color: "white",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        padding: 18,
        display: "flex",
        justifyContent: "center",
    },
    container: { width: "100%", maxWidth: 520 },
    header: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginTop: 12, marginBottom: 16 },
    h1: { fontSize: 44, fontWeight: 800, letterSpacing: -1 },
    sub: { opacity: 0.8, marginTop: 6, fontSize: 14 },
    badge: { opacity: 0.9, fontSize: 12, padding: "6px 10px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, background: "rgba(255,255,255,0.05)" },
    card: { borderRadius: 18, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", padding: 16 },
    row: { display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" },
    label: { opacity: 0.75, fontSize: 13 },
    value: { fontWeight: 700, fontSize: 14 },
    line: { fontSize: 14, padding: "8px 0" },
    cta: {
        width: "100%",
        marginTop: 16,
        padding: "14px 14px",
        borderRadius: 14,
        border: "none",
        background: "white",
        color: "#0b0b0f",
        fontWeight: 800,
        fontSize: 16,
        cursor: "pointer",
    },
    small: { marginTop: 10, fontSize: 12, opacity: 0.75, lineHeight: 1.35 },
    footer: { marginTop: 14, fontSize: 12, opacity: 0.6, textAlign: "center" },
};
