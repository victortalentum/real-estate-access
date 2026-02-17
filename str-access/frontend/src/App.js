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
exports.default = App;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
function formatDate(iso) {
    if (!iso)
        return "—";
    var d = new Date(iso);
    if (Number.isNaN(d.getTime()))
        return iso;
    return d.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function safeJson(res) {
    return __awaiter(this, void 0, void 0, function () {
        var ct, text, snippet, snippet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ct = res.headers.get("content-type") || "";
                    return [4 /*yield*/, res.text()];
                case 1:
                    text = _a.sent();
                    // Si no es JSON, te enseñamos un snippet para debug
                    if (!ct.includes("application/json")) {
                        snippet = text.slice(0, 220).replace(/\s+/g, " ").trim();
                        throw new Error("API returned non-JSON (HTTP ".concat(res.status, "). ").concat(snippet));
                    }
                    try {
                        return [2 /*return*/, JSON.parse(text)];
                    }
                    catch (_b) {
                        snippet = text.slice(0, 220).replace(/\s+/g, " ").trim();
                        throw new Error("Invalid JSON (HTTP ".concat(res.status, "). ").concat(snippet));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function App() {
    var _this = this;
    var reservationId = (0, react_1.useMemo)(function () {
        var p = window.location.pathname.replace(/^\/+/, "").trim(); // "RES-123"
        if (!p)
            return null;
        // Evita confusiones si alguien abre /api/... en el navegador:
        if (p.startsWith("api/"))
            return null;
        return p;
    }, []);
    var _a = (0, react_1.useState)(!!reservationId), loading = _a[0], setLoading = _a[1];
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    var _c = (0, react_1.useState)(null), reservation = _c[0], setReservation = _c[1];
    (0, react_1.useEffect)(function () {
        if (!reservationId)
            return;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var url, res, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        url = "".concat(window.location.origin, "/api/reservations/by-id/").concat(encodeURIComponent(reservationId));
                        return [4 /*yield*/, fetch(url, {
                                headers: { Accept: "application/json" },
                                cache: "no-store",
                            })];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, safeJson(res)];
                    case 3:
                        data = _a.sent();
                        if (!res.ok || !(data === null || data === void 0 ? void 0 : data.ok))
                            throw new Error((data === null || data === void 0 ? void 0 : data.error) || "HTTP ".concat(res.status));
                        setReservation(data.reservation);
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _a.sent();
                        setError((e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || String(e_1));
                        return [3 /*break*/, 6];
                    case 5:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); })();
    }, [reservationId]);
    // Pantalla “home” si abren apartments-nyc.com sin /RES-xxx
    if (!reservationId) {
        return ((0, jsx_runtime_1.jsxs)("div", { style: styles.shell, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.header, children: (0, jsx_runtime_1.jsx)("div", { style: styles.h1, children: "Access" }) }), (0, jsx_runtime_1.jsxs)("div", { style: styles.card, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.cardTitle, children: "Open the link you received (it ends with your reservation id)." }), (0, jsx_runtime_1.jsx)("div", { style: styles.muted, children: "Example: apartments-nyc.com/RES-123" })] })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { style: styles.shell, children: [(0, jsx_runtime_1.jsxs)("div", { style: styles.header, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.h1, children: "Access" }), (0, jsx_runtime_1.jsx)("div", { style: styles.pill, children: "apartments-nyc.com" })] }), (0, jsx_runtime_1.jsxs)("div", { style: __assign(__assign({}, styles.card), { gap: 14 }), children: [(0, jsx_runtime_1.jsxs)("div", { style: styles.topRow, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: __assign(__assign({}, styles.h2), { marginBottom: 6 }), children: (reservation === null || reservation === void 0 ? void 0 : reservation.property) || "Your stay" }), (0, jsx_runtime_1.jsxs)("div", { style: styles.subtitle, children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Reservation ", reservationId] }), (reservation === null || reservation === void 0 ? void 0 : reservation.name) ? (0, jsx_runtime_1.jsxs)("div", { children: ["Guest: ", reservation.name] }) : null, (reservation === null || reservation === void 0 ? void 0 : reservation.address) ? (0, jsx_runtime_1.jsx)("div", { children: reservation.address }) : null] })] }), (0, jsx_runtime_1.jsx)("span", { style: styles.statusPill, children: loading ? "Loading" : error ? "Issue" : "Active" })] }), loading ? ((0, jsx_runtime_1.jsx)("div", { style: styles.notice, children: "Loading\u2026" })) : error ? ((0, jsx_runtime_1.jsxs)("div", { style: __assign(__assign({}, styles.notice), { borderColor: "rgba(255,120,120,0.35)" }), children: [(0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 700, marginBottom: 6 }, children: "Error" }), (0, jsx_runtime_1.jsx)("div", { style: { whiteSpace: "pre-wrap" }, children: error }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 10, opacity: 0.8, fontSize: 13 }, children: ["Tip: prueba tambi\u00E9n abrir ", (0, jsx_runtime_1.jsx)("b", { children: "/api/health" }), " y ", (0, jsx_runtime_1.jsxs)("b", { children: ["/api/reservations/by-id/", reservationId] }), " para ver si responde JSON."] })] })) : !reservation ? ((0, jsx_runtime_1.jsx)("div", { style: styles.notice, children: "Reservation not found" })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { style: styles.grid2, children: [(0, jsx_runtime_1.jsxs)("div", { style: styles.kv, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.k, children: "Check-in" }), (0, jsx_runtime_1.jsx)("div", { style: styles.v, children: formatDate(reservation.checkInISO) })] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.kv, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.k, children: "Check-out" }), (0, jsx_runtime_1.jsx)("div", { style: styles.v, children: formatDate(reservation.checkOutISO) })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 6 }, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.sectionTitle, children: "Steps" }), (0, jsx_runtime_1.jsx)("div", { style: styles.steps, children: (reservation.steps && reservation.steps.length ? reservation.steps : demoSteps).map(function (s) { return ((0, jsx_runtime_1.jsxs)("div", { style: styles.stepCard, children: [(0, jsx_runtime_1.jsxs)("div", { style: styles.stepTop, children: [(0, jsx_runtime_1.jsx)("div", { style: styles.stepTitle, children: s.title }), s.actionLabel ? (0, jsx_runtime_1.jsx)("button", { style: styles.btn, children: s.actionLabel }) : null] }), s.description ? (0, jsx_runtime_1.jsx)("div", { style: styles.stepDesc, children: s.description }) : null] }, s.id)); }) })] })] }))] }), (0, jsx_runtime_1.jsx)("div", { style: styles.footer, children: (0, jsx_runtime_1.jsx)("div", { style: styles.muted, children: "This page is unique per reservation. We\u2019ll connect it to Hospitable next." }) })] }));
}
var demoSteps = [
    { id: "s1", title: "Building entry", description: "Use the intercom link (or call button) to open the main door.", actionLabel: "Open door" },
    { id: "s2", title: "Apartment entry", description: "Use the keypad code (shown here later) or smart lock link.", actionLabel: "Get code" },
    { id: "s3", title: "Wi-Fi", description: "Network name and password will appear here.", actionLabel: "Copy" },
];
var styles = {
    shell: {
        minHeight: "100vh",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "radial-gradient(1200px 800px at 20% 10%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(900px 700px at 80% 0%, rgba(255,255,255,0.06), transparent 60%), #0b0c10",
        color: "rgba(255,255,255,0.92)",
    },
    header: {
        width: "100%",
        maxWidth: 860,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        marginBottom: 14,
    },
    h1: { fontSize: 44, fontWeight: 800, letterSpacing: -0.8 },
    pill: {
        padding: "8px 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.06)",
        fontSize: 13,
        opacity: 0.9,
    },
    card: {
        width: "100%",
        maxWidth: 860,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.06)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
    },
    cardTitle: { fontSize: 18, fontWeight: 700, marginBottom: 8 },
    topRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
    h2: { fontSize: 22, fontWeight: 800, letterSpacing: -0.3 },
    subtitle: { fontSize: 14, opacity: 0.85, display: "grid", gap: 4 },
    statusPill: {
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "rgba(255,255,255,0.05)",
        fontSize: 12,
        fontWeight: 700,
    },
    notice: {
        marginTop: 8,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(0,0,0,0.18)",
        padding: 14,
        fontSize: 14,
    },
    grid2: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginTop: 10,
    },
    kv: {
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(0,0,0,0.14)",
        padding: 12,
    },
    k: { fontSize: 12, opacity: 0.75, marginBottom: 6 },
    v: { fontSize: 14, fontWeight: 700 },
    sectionTitle: { fontSize: 16, fontWeight: 800, marginTop: 12, marginBottom: 10 },
    steps: { display: "grid", gap: 10 },
    stepCard: {
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(0,0,0,0.14)",
        padding: 12,
    },
    stepTop: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" },
    stepTitle: { fontSize: 14, fontWeight: 800 },
    stepDesc: { fontSize: 13, opacity: 0.85, marginTop: 6, lineHeight: 1.35 },
    btn: {
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.92)",
        padding: "7px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
    },
    muted: { opacity: 0.75, fontSize: 13, marginTop: 4 },
    footer: { width: "100%", maxWidth: 860, marginTop: 14, paddingBottom: 16 },
};
