"use strict";
var Response_1 = require('../Response');
var es6_promise_1 = require('es6-promise');
var net = require('net');
var TunnellingBlock = (function () {
    function TunnellingBlock() {
        this.name = "decrypt secure connection";
    }
    TunnellingBlock.prototype.process = function (context, pReq, next) {
        if (pReq.method.toUpperCase() === "CONNECT") {
            return new es6_promise_1.Promise(function (resolve, reject) {
                var spliturl = pReq.url.split(':');
                var tunnelPort = spliturl.length < 2 ? 443 : parseInt(spliturl[1]);
                var tunnelHost = spliturl[0];
                // var proxySocket = new net.Socket({
                //     readable: true,
                //     writable: true
                // });
                var proxySocket = new net.Socket();
                proxySocket.connect(tunnelPort, tunnelHost, function () {
                    var pRes = new Response_1.default();
                    pRes.statusCode = 200;
                    pRes.body = proxySocket;
                    pReq.body.pipe(proxySocket);
                    resolve(pRes);
                });
                proxySocket.on('error', function (er) {
                    reject(er);
                });
            });
        }
        return next(context, pReq);
    };
    return TunnellingBlock;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TunnellingBlock;
//# sourceMappingURL=TunnellingBlock.js.map