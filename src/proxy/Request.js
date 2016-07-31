"use strict";
var Request = (function () {
    function Request() {
    }
    Request.fromIncomingMessage = function (message) {
        var pReq = new Request();
        pReq.headers = message.headers;
        pReq.method = message.method;
        pReq.url = message.url;
        pReq.httpVersion = message.httpVersion;
        pReq.body = message;
        return pReq;
    };
    return Request;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Request;
//# sourceMappingURL=Request.js.map