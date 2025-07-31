"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.__esModule = true;
var express_1 = require("express");
var webPush = require("web-push");
var body_parser_1 = require("body-parser");
var cors_1 = require("cors");
var app = (0, express_1["default"])();
app.use((0, cors_1["default"])());
app.use(body_parser_1["default"].json());
// DO NOT USE IN PROD
var publicKey = 'BDZJSiMXSJUhryPkjFh_H84ZeEjVNfq5STCXVDEW4bpXye1mybGCjufRFIVmMxJN1wHOGUunGyBra0qvSa0fGJ8';
var privateKey = 'upQsMoPu4_T6aT3a8Nwg8b7Cd3wNjQwfD5PgCYJjTmc';
webPush.setVapidDetails('mailto:example@yourdomain.org', publicKey, privateKey);
var subscriptions = {};
app.post('/subscribe', function (req, res) {
    try {
        var _a = req.body, subscription = _a.subscription, id = _a.id;
        subscriptions[id] = subscription;
        console.log('Subscription success!', subscription);
        return res.status(201).json({ data: { success: true } });
    }
    catch (error) {
        console.error('Error subscribing:', error);
        return res.status(400).json({ data: { success: false } });
    }
});
app.post('/send', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, message, title, id, subscription, payload, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                console.log('Sending notification!');
                console.log('Sending notification!');
                _a = req.body, message = _a.message, title = _a.title, id = _a.id;
                console.log(message, title, id);
                subscription = subscriptions[id];
                if (!subscription) {
                    console.error('No subscription found for id:', id);
                    return [2 /*return*/, res.status(400).json({ data: { success: false } })];
                }
                payload = JSON.stringify({ title: title, message: message });
                console.log('Sending notification!', subscription);
                console.log('Payload:', payload);
                return [4 /*yield*/, webPush.sendNotification(subscription, payload)];
            case 1:
                _b.sent();
                console.log('Notification sent!');
                return [2 /*return*/, res.status(201).json({ data: { success: true } })];
            case 2:
                error_1 = _b.sent();
                console.error('Error sending:', error_1);
                // Handle specific web-push errors
                if (error_1.statusCode === 410) {
                    // Subscription has expired or been unsubscribed
                    console.log('Subscription expired/unsubscribed, removing from storage');
                    return [2 /*return*/, res.status(410).json({
                            data: {
                                success: false,
                                error: 'Subscription expired or unsubscribed'
                            }
                        })];
                }
                return [2 /*return*/, res.status(400).json({ data: { success: false, error: error_1.message } })];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/info', function (req, res) {
    return res.status(200).json({ data: JSON.stringify(subscriptions) });
});
app.listen(3003, function () {
    console.log('Server started on port 3003');
});
