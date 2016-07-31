"use strict";
var Request_1 = require('./Request');
exports.Request = Request_1.default;
var Response_1 = require('./Response');
exports.Response = Response_1.default;
var TunnellingBlock_1 = require('./processingBlocks/TunnellingBlock');
var SendRequestBlock_1 = require('./processingBlocks/SendRequestBlock');
var MultiBlock_1 = require('./processingBlocks/MultiBlock');
exports.MultiProcessingBlock = MultiBlock_1.default;
var es6_promise_1 = require('es6-promise');
var http = require('http');
var Proxy = (function () {
    function Proxy() {
        this.self = this;
        this.blocks = new MultiBlock_1.default([
            new TunnellingBlock_1.default(),
            new SendRequestBlock_1.default(),
        ]);
    }
    Proxy.prototype.handleIfProxyRequest = function (request, response, next) {
        var isProxyRequest = request.url.indexOf("/") !== 0;
        if (isProxyRequest) {
            this.handleRequest(request, response);
        }
        else {
            next();
        }
    };
    Proxy.prototype.handleRequest = function (request, response) {
        var context = {
            originalRequest: request,
            originResponse: response
        };
        var pReq = Request_1.default.fromIncomingMessage(request);
        this.blocks.process(context, pReq, Proxy.rejectRequest).then(function (pRes) {
            //write our response out
            response.writeHead(pRes.statusCode, pRes.headers);
            pRes.body.pipe(response);
        }).catch(function (ex) {
            //write out bad gateway error
            console.error(ex);
            response.writeHead(502);
            response.end();
        });
    };
    Proxy.prototype.handleConnect = function (request, socket) {
        var context = {
            originalRequest: request,
            originResponse: socket,
        };
        var pReq = Request_1.default.fromIncomingMessage(request);
        pReq.body = socket; //our body is from the socket in this case
        var hasOutputStarted = false;
        this.blocks.process(context, pReq, Proxy.rejectRequest).then(function (pRes) {
            hasOutputStarted = true;
            if (pRes.statusCode == 200) {
                //write out the header manually as we have to use the raw socket
                socket.write('HTTP/1.1 200 Connection established' + Proxy.newline + Proxy.newline);
                //pipe out everything in our socket, this will be the 'encrypted' traffic
                pRes.body.pipe(socket);
            }
            else {
                var statusCode = pRes.statusCode;
                var statusMessage = http.STATUS_CODES[statusCode];
                socket.write('HTTP/1.1 ');
                socket.write(statusCode);
                socket.write(' ');
                socket.write(statusMessage);
                socket.write(Proxy.newline + Proxy.newline);
                socket.end();
            }
        }).catch(function (ex) {
            console.error(ex);
            if (!hasOutputStarted && socket.writable)
                socket.write('HTTP/1.1 502 Bad gateway');
            socket.end();
        });
    };
    Proxy.newline = '\r\n';
    Proxy.rejectRequest = function (context, pReq) { return es6_promise_1.Promise.reject("There are no more blocks to process"); };
    return Proxy;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Proxy;
exports.Proxy = Proxy;
//# sourceMappingURL=Proxy.js.map