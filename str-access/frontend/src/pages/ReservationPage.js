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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationPage = ReservationPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Countdown_1 = require("../components/Countdown");
var StatusPill_1 = require("../components/StatusPill");
var StepCard_1 = require("../components/StepCard");
var reservation_1 = require("../mock/reservation");
function isValidDate(d) {
    return d instanceof Date && !Number.isNaN(d.getTime());
}
function formatDate(d) {
    try {
        return d.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    catch (_a) {
        return String(d);
    }
}
// IMPORTANT:
// - En Vercel, tus functions viven en /api/*
// - En local con `vercel dev`, también es /api/*
var API_BASE = (_b = (_a = import.meta.env) === null || _a === void 0 ? void 0 : _a.VITE_API_BASE) !== null && _b !== void 0 ? _b : "/api";
function readJsonSafely(res) {
    return __awaiter(this, void 0, void 0, function () {
        var contentType, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contentType = res.headers.get("content-type") || "";
                    return [4 /*yield*/, res.text()];
                case 1:
                    text = _a.sent();
                    // Si nos llega HTML (por ejemplo un index.html por rewrites), aquí lo detectamos
                    if (contentType.includes("text/html") ||
                        text.trim().startsWith("<!doctype") ||
                        text.trim().startsWith("<html")) {
                        throw new Error("API is returning HTML instead of JSON. This usually means you're hitting the Vite server (5173) instead of `vercel dev` (3000), or your rewrites are catching /api.");
                    }
                    try {
                        return [2 /*return*/, JSON.parse(text)];
                    }
                    catch (_b) {
                        throw new Error("Invalid JSON from API. First chars: ".concat(text.slice(0, 80)));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function fetchReservationByCode(code) {
    return __awaiter(this, void 0, void 0, function () {
        var res, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(API_BASE, "/reservations/by-code/").concat(encodeURIComponent(code)), { headers: { Accept: "application/json" } })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, readJsonSafely(res)];
                case 2:
                    json = _a.sent();
                    // backend returns: { ok, reservation }
                    if (!res.ok || !(json === null || json === void 0 ? void 0 : json.ok))
                        throw new Error((json === null || json === void 0 ? void 0 : json.error) || "Reservation not found");
                    return [2 /*return*/, json.reservation];
            }
        });
    });
}
function MapEmbed(_a) {
    var address = _a.address;
    var q = encodeURIComponent(address || "");
    var src = "https://www.google.com/maps?q=".concat(q, "&output=embed");
    return ((0, jsx_runtime_1.jsx)("iframe", { title: "map", src: src, width: "100%", height: "320", style: { border: 0, borderRadius: 16 }, loading: "lazy", referrerPolicy: "no-referrer-when-downgrade" }));
}
function SectionHeader(_a) {
    var index = _a.index, title = _a.title, subtitle = _a.subtitle, right = _a.right;
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 12,
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: "flex", gap: 12, alignItems: "flex-start" }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                            width: 34,
                            height: 34,
                            borderRadius: 12,
                            display: "grid",
                            placeItems: "center",
                            fontWeight: 800,
                            fontSize: 14,
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }, children: index }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { style: { fontSize: 18, fontWeight: 800, lineHeight: 1.2 }, children: title }), subtitle ? ((0, jsx_runtime_1.jsx)("div", { className: "muted small", style: { marginTop: 6, maxWidth: 720 }, children: subtitle })) : null] })] }), right ? (0, jsx_runtime_1.jsx)("div", { style: { textAlign: "right" }, children: right }) : null] }));
}
function InstructionPhoto(_a) {
    var src = _a.src, alt = _a.alt;
    if (!src)
        return null;
    return ((0, jsx_runtime_1.jsx)("img", { src: src, alt: alt, style: {
            width: "100%",
            height: 260,
            objectFit: "cover",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 12,
        } }));
}
function resolveStepPhoto(stepId, stepPhotoUrl, photos) {
    if (stepPhotoUrl)
        return stepPhotoUrl;
    var list = photos !== null && photos !== void 0 ? photos : [];
    var s = stepId.toLowerCase();
    var matchByKeywords = function (keywords) {
        return list.find(function (p) { return keywords.some(function (k) { return p.toLowerCase().includes(k); }); });
    };
    if (s === "building")
        return matchByKeywords(["building", "portal", "entrance", "front"]) || list[0];
    if (s === "apartment")
        return matchByKeywords(["apartment", "unit", "door", "flat"]) || list[1] || list[0];
    if (s === "room")
        return matchByKeywords(["room"]) || list[2] || list[0];
    return list[0];
}
function WifiBlock(_a) {
    var wifi = _a.wifi;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "card", children: [(0, jsx_runtime_1.jsx)("div", { className: "cardHeader", children: (0, jsx_runtime_1.jsx)("div", { className: "cardTitle", children: "Wi-Fi" }) }), (0, jsx_runtime_1.jsx)("div", { className: "cardBody", children: !(wifi === null || wifi === void 0 ? void 0 : wifi.ssid) ? ((0, jsx_runtime_1.jsx)("div", { className: "muted", children: "Wi-Fi not configured yet." })) : ((0, jsx_runtime_1.jsxs)("div", { style: { display: "grid", gap: 12 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: "grid", gap: 6 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "muted small", children: "Network (SSID)" }), (0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 800, fontSize: 16 }, children: wifi.ssid })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: "grid", gap: 6 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "muted small", children: "Password" }), (0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 800, fontSize: 16 }, children: wifi.password })] }), wifi.notes ? ((0, jsx_runtime_1.jsx)("div", { className: "muted small", children: wifi.notes })) : ((0, jsx_runtime_1.jsx)("div", { className: "muted small", children: "Tip: if you have issues, stand closer to the router for first connection." }))] })) })] }));
}
/**
 * ✅ FIX CLAVE:
 * - code ya NO se guarda “para siempre” en useState inicial
 * - se recalcula con params + query cada vez que cambie la URL
 */
function useAccessCode() {
    var params = (0, react_router_dom_1.useParams)();
    var location = (0, react_router_dom_1.useLocation)();
    return (0, react_1.useMemo)(function () {
        var routeCode = typeof params.code === "string" ? String(params.code) : "";
        var sp = new URLSearchParams(location.search);
        var queryCode = sp.get("code") || sp.get("c") || "";
        return routeCode || queryCode || "";
    }, [params, location.search]);
}
function ReservationPage() {
    var _a = (0, react_1.useState)(function () { return new Date(); }), now = _a[0], setNow = _a[1];
    var code = useAccessCode();
    // API state
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(""), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(null), reservation = _d[0], setReservation = _d[1];
    var _e = (0, react_1.useState)({}), loadingByStep = _e[0], setLoadingByStep = _e[1];
    var _f = (0, react_1.useState)({}), resultByStep = _f[0], setResultByStep = _f[1];
    (0, react_1.useEffect)(function () {
        var t = window.setInterval(function () { return setNow(new Date()); }, 1000);
        return function () { return window.clearInterval(t); };
    }, []);
    (0, react_1.useEffect)(function () {
        if (!code) {
            setError("Missing access code. Please open the link provided in your message.");
            setReservation(null);
            return;
        }
        var cancelled = false;
        setLoading(true);
        setError("");
        fetchReservationByCode(code)
            .then(function (r) {
            if (cancelled)
                return;
            setReservation(r);
        })
            .catch(function (e) {
            if (cancelled)
                return;
            setError((e === null || e === void 0 ? void 0 : e.message) || "Failed to load reservation");
            setReservation(null);
        })
            .finally(function () {
            if (cancelled)
                return;
            setLoading(false);
        });
        return function () {
            cancelled = true;
        };
    }, [code]);
    var checkIn = (0, react_1.useMemo)(function () { return new Date((reservation === null || reservation === void 0 ? void 0 : reservation.checkInISO) || ""); }, [reservation === null || reservation === void 0 ? void 0 : reservation.checkInISO]);
    var checkOut = (0, react_1.useMemo)(function () { return new Date((reservation === null || reservation === void 0 ? void 0 : reservation.checkOutISO) || ""); }, [reservation === null || reservation === void 0 ? void 0 : reservation.checkOutISO]);
    var phase = (0, react_1.useMemo)(function () {
        if (!isValidDate(checkIn) || !isValidDate(checkOut))
            return "before";
        return (0, reservation_1.getAccessState)(now, checkIn, checkOut);
    }, [now, checkIn, checkOut]);
    var buttonsEnabled = phase === "active";
    var countdownTarget = (0, react_1.useMemo)(function () {
        if (!isValidDate(checkIn) || !isValidDate(checkOut))
            return null;
        if (phase === "before")
            return checkIn;
        if (phase === "active")
            return checkOut;
        return null;
    }, [phase, checkIn, checkOut]);
    var countdownLabel = (0, react_1.useMemo)(function () {
        if (phase === "before")
            return "Access starts in";
        if (phase === "active")
            return "Access ends in";
        return "Reservation ended";
    }, [phase]);
    var headerLine = loading ? "Loading…" : error ? "Error: ".concat(error) : "Access code: ".concat(code);
    var mapAddress = (reservation === null || reservation === void 0 ? void 0 : reservation.mapAddress) || (reservation === null || reservation === void 0 ? void 0 : reservation.address) || "";
    var orderedSteps = (0, react_1.useMemo)(function () {
        var _a;
        var steps = (_a = reservation === null || reservation === void 0 ? void 0 : reservation.steps) !== null && _a !== void 0 ? _a : [];
        var byId = new Map(steps.map(function (s) { return [s.id, s]; }));
        var ordered = [];
        if (byId.get("building"))
            ordered.push(byId.get("building"));
        if (byId.get("apartment"))
            ordered.push(byId.get("apartment"));
        if (byId.get("room"))
            ordered.push(byId.get("room"));
        for (var _i = 0, steps_1 = steps; _i < steps_1.length; _i++) {
            var s = steps_1[_i];
            if (s.id !== "building" && s.id !== "apartment" && s.id !== "room")
                ordered.push(s);
        }
        return ordered;
    }, [reservation === null || reservation === void 0 ? void 0 : reservation.steps]);
    function unlockStep(stepId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, json, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!buttonsEnabled)
                            return [2 /*return*/];
                        setLoadingByStep(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[stepId] = true, _a)));
                        });
                        setResultByStep(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[stepId] = "idle", _a)));
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, fetch("".concat(API_BASE, "/unlock"), {
                                method: "POST",
                                headers: { "Content-Type": "application/json", Accept: "application/json" },
                                body: JSON.stringify({ code: code, stepId: stepId, action: stepId }),
                            })];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, readJsonSafely(res)];
                    case 3:
                        json = _a.sent();
                        if (!res.ok || !(json === null || json === void 0 ? void 0 : json.ok))
                            throw new Error((json === null || json === void 0 ? void 0 : json.error) || "Unlock failed");
                        setResultByStep(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[stepId] = "success", _a)));
                        });
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _a.sent();
                        setResultByStep(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[stepId] = "error", _a)));
                        });
                        console.warn(e_1);
                        return [3 /*break*/, 6];
                    case 5:
                        setLoadingByStep(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[stepId] = false, _a)));
                        });
                        setTimeout(function () { return setResultByStep(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[stepId] = "idle", _a)));
                        }); }, 3500);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    var stepSubtitle = function (stepId) {
        var s = stepId.toLowerCase();
        if (s === "building")
            return "First, open the building entrance door. Tap the button to unlock.";
        if (s === "apartment")
            return "Next, go to the apartment door. Tap the button to unlock.";
        if (s === "room")
            return "If applicable, unlock your private room door.";
        return "Follow the instructions below and tap the button to unlock.";
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "page", children: (0, jsx_runtime_1.jsxs)("div", { className: "container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "pageHeader", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "pageTitle", children: "Access" }), (0, jsx_runtime_1.jsx)("div", { className: "muted small", children: headerLine }), (reservation === null || reservation === void 0 ? void 0 : reservation.displayName) ? ((0, jsx_runtime_1.jsx)("div", { className: "muted small", style: { marginTop: 6 }, children: reservation.displayName })) : null] }), (0, jsx_runtime_1.jsxs)("div", { style: { textAlign: "right" }, children: [(0, jsx_runtime_1.jsx)(StatusPill_1.StatusPill, { phase: phase }), (0, jsx_runtime_1.jsx)("div", { className: "muted small", style: { marginTop: 6 }, children: (reservation === null || reservation === void 0 ? void 0 : reservation.reservationId) ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Internal ID", (0, jsx_runtime_1.jsx)("div", { style: { fontWeight: 800, marginTop: 2 }, children: reservation.reservationId })] })) : (" ") }), (0, jsx_runtime_1.jsx)("button", { className: "btn btnSecondary", onClick: function () { return setNow(new Date()); }, children: "Refresh" })] })] }), !reservation ? ((0, jsx_runtime_1.jsxs)("div", { className: "card", children: [(0, jsx_runtime_1.jsx)("div", { className: "cardHeader", children: (0, jsx_runtime_1.jsx)("div", { className: "cardTitle", children: "Stay details" }) }), (0, jsx_runtime_1.jsx)("div", { className: "cardBody", children: (0, jsx_runtime_1.jsx)("div", { className: "muted", children: loading ? "Loading reservation…" : error ? error : "No reservation found." }) })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "cardHeader", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "cardTitle", children: "Stay details" }), (0, jsx_runtime_1.jsxs)("div", { className: "muted small", style: { marginTop: 6 }, children: ["Access code: ", (0, jsx_runtime_1.jsx)("span", { style: { fontWeight: 800 }, children: code })] })] }), (0, jsx_runtime_1.jsxs)("div", { style: { textAlign: "right" }, children: [phase === "after" ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "muted small", children: countdownLabel }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: 18, fontWeight: 800, marginTop: 2 }, children: "Ended" })] })) : countdownTarget ? ((0, jsx_runtime_1.jsx)(Countdown_1.Countdown, { target: countdownTarget, now: now, label: countdownLabel })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "muted small", children: "Access" }), (0, jsx_runtime_1.jsx)("div", { style: { fontSize: 18, fontWeight: 800, marginTop: 2 }, children: "\u2014" })] })), (0, jsx_runtime_1.jsx)("div", { className: "muted small", style: { marginTop: 6 }, children: phase === "before"
                                                        ? "The unlock buttons will activate automatically at check-in time."
                                                        : phase === "active"
                                                            ? "Buttons are active during your reservation window."
                                                            : "Reservation window has ended." })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "cardBody", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "muted small", children: "Address" }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 6 }, children: reservation.address || "-" }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 16 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "muted small", children: "Check-out" }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 6 }, children: isValidDate(checkOut) ? formatDate(checkOut) : "-" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "muted small", children: "Check-in" }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 6 }, children: isValidDate(checkIn) ? formatDate(checkIn) : "-" }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: 16 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "muted small", children: "Access" }), (0, jsx_runtime_1.jsx)("div", { style: { marginTop: 6 }, className: "muted", children: phase === "before" ? "Not active yet" : phase === "active" ? "Active" : "Ended" })] })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "cardHeader", children: [(0, jsx_runtime_1.jsx)("div", { className: "cardTitle", children: "Step-by-step access" }), (0, jsx_runtime_1.jsx)("div", { className: "muted small", style: { textAlign: "right" }, children: buttonsEnabled ? "Available now" : "Available during your reservation window" })] }), (0, jsx_runtime_1.jsx)("div", { className: "cardBody", children: orderedSteps.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "muted", children: "No access steps configured yet." })) : ((0, jsx_runtime_1.jsx)("div", { style: { display: "grid", gap: 18 }, children: orderedSteps.map(function (step, idx) {
                                            var _a;
                                            var isLoading = !!loadingByStep[step.id];
                                            var result = (_a = resultByStep[step.id]) !== null && _a !== void 0 ? _a : "idle";
                                            var actionLabel = isLoading ? "Unlocking…" : step.actionLabel || "Unlock";
                                            var disabled = !buttonsEnabled || isLoading;
                                            var photo = resolveStepPhoto(step.id, step.photoUrl, reservation.photos);
                                            return ((0, jsx_runtime_1.jsxs)("div", { style: {
                                                    padding: 14,
                                                    borderRadius: 18,
                                                    border: "1px solid rgba(255,255,255,0.08)",
                                                    background: "rgba(255,255,255,0.03)",
                                                }, children: [(0, jsx_runtime_1.jsx)(SectionHeader, { index: idx + 1, title: step.title, subtitle: stepSubtitle(step.id), right: !buttonsEnabled ? ((0, jsx_runtime_1.jsx)("div", { className: "muted small", children: "Available at check-in" })) : ((0, jsx_runtime_1.jsx)("div", { className: "muted small", children: "Tap to unlock" })) }), (0, jsx_runtime_1.jsx)(InstructionPhoto, { src: photo, alt: "".concat(step.id, "-photo") }), (0, jsx_runtime_1.jsx)(StepCard_1.StepCard, { title: "Instructions", description: step.description, actionLabel: actionLabel, disabled: disabled, onAction: function () { return unlockStep(step.id); } }), result !== "idle" && ((0, jsx_runtime_1.jsx)("div", { className: "muted small", style: { marginTop: 10, marginLeft: 4 }, children: result === "success" ? "✅ Unlocked" : "❌ Failed — try again" }))] }, step.id));
                                        }) })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "card", children: [(0, jsx_runtime_1.jsx)("div", { className: "cardHeader", children: (0, jsx_runtime_1.jsx)("div", { className: "cardTitle", children: "Location" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "cardBody", children: [(0, jsx_runtime_1.jsx)(MapEmbed, { address: mapAddress }), (0, jsx_runtime_1.jsx)("div", { className: "muted small", style: { marginTop: 8 }, children: mapAddress })] })] }), (0, jsx_runtime_1.jsx)(WifiBlock, { wifi: reservation.wifi })] }))] }) }));
}
