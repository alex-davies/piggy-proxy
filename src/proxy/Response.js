"use strict";
var Response = (function () {
    function Response() {
    }
    Response.fromIncomingMessage = function (message) {
        var pRes = new Response();
        pRes.statusCode = message.statusCode;
        pRes.headers = message.headers;
        pRes.body = message;
        return pRes;
    };
    return Response;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Response;
//# sourceMappingURL=Response.js.map