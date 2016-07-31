"use strict";
var Response_1 = require('../Response');
var es6_promise_1 = require('es6-promise');
var makeRequest = require('request');
var SendRequestBlock = (function () {
    function SendRequestBlock() {
        this.name = "Perform Call";
    }
    SendRequestBlock.prototype.process = function (context, pReq, next) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var externalRequest = makeRequest(pReq.url, {
                method: pReq.method,
                headers: pReq.headers
            }).on('response', function (res) {
                context.proxyResponse = res;
                var pRes = Response_1.default.fromIncomingMessage(res);
                resolve(pRes);
            }).on('error', function (err) {
                reject(err);
            });
            pReq.body.pipe(externalRequest);
        });
    };
    return SendRequestBlock;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SendRequestBlock;
//# sourceMappingURL=SendRequestBlock.js.map