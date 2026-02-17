"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockReservation = void 0;
exports.getAccessState = getAccessState;
exports.msUntilCheckOut = msUntilCheckOut;
exports.formatDuration = formatDuration;
function getAccessState(now, checkIn, checkOut) {
    var t = now.getTime();
    if (t < checkIn.getTime())
        return "before";
    if (t > checkOut.getTime())
        return "after";
    return "active";
}
/**
 * Countdown helper (use this in the UI with a `now` that updates every second).
 */
function msUntilCheckOut(now, checkOut) {
    return Math.max(0, checkOut.getTime() - now.getTime());
}
/**
 * Optional helper: turn milliseconds into "1d 15h 08m 03s".
 */
function formatDuration(ms) {
    var totalSeconds = Math.floor(ms / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    var pad2 = function (n) { return String(n).padStart(2, "0"); };
    return "".concat(days, "d ").concat(hours, "h ").concat(pad2(minutes), "m ").concat(pad2(seconds), "s");
}
/**
 * DEV ONLY mock.
 * Uses dynamic dates so the reservation is "active" when you open the page.
 */
function toIsoWithOffset(d) {
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var year = d.getFullYear();
    var month = pad(d.getMonth() + 1);
    var day = pad(d.getDate());
    var hours = pad(d.getHours());
    var minutes = pad(d.getMinutes());
    var seconds = pad(d.getSeconds());
    var offsetMin = -d.getTimezoneOffset();
    var sign = offsetMin >= 0 ? "+" : "-";
    var abs = Math.abs(offsetMin);
    var offH = pad(Math.floor(abs / 60));
    var offM = pad(abs % 60);
    return "".concat(year, "-").concat(month, "-").concat(day, "T").concat(hours, ":").concat(minutes, ":").concat(seconds).concat(sign).concat(offH, ":").concat(offM);
}
var now = new Date();
var checkIn = new Date(now.getTime() - 60 * 60 * 1000); // 1h ago
var checkOut = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // in 2 days
exports.mockReservation = {
    reservationId: "res_test_1",
    displayName: "Demo property",
    address: "131 E 15th St, New York, NY 10003",
    mapAddress: "131 E 15th St, New York, NY 10003",
    checkInISO: toIsoWithOffset(checkIn),
    checkOutISO: toIsoWithOffset(checkOut),
    steps: [
        {
            id: "building",
            title: "Building entrance",
            description: "Press the button and the building door will open.",
            actionLabel: "Open building door",
            photoUrl: "/static/photos/portal.jpg",
        },
        {
            id: "apartment",
            title: "Apartment door",
            description: "Press the button and the apartment door will open.",
            actionLabel: "Open apartment door",
            photoUrl: "/static/photos/apartment.jpg",
        },
    ],
    wifi: {
        ssid: "MY_WIFI",
        password: "MY_PASSWORD",
        notes: "Network is 2.4G/5G; use the same password.",
    },
};
