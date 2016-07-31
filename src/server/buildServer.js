"use strict";
var http = require('http');
var express = require('express');
var es6_promise_1 = require('es6-promise');
var Proxy_1 = require("../proxy/Proxy");
var path = require("path");
var ioFactory = require("socket.io");
var Uuid = require("node-uuid");
function buildServer() {
    var expressApp = express();
    var proxy = new Proxy_1.Proxy();
    expressApp.use(proxy.handleIfProxyRequest.bind(proxy));
    expressApp.use(express.static(path.join(__dirname, '../client')));
    var httpServer = http.createServer(expressApp);
    var io = ioFactory(httpServer);
    //Handle connect (https) requests
    httpServer.on('connect', function (req, socket, head) {
        console.log('tunnel request from %s:%s', socket.remoteAddress, socket.remotePort);
        proxy.handleConnect(req, socket);
    });
    var subscribe = io.of('/subscribe');
    proxy.blocks.unshift(new NotifySubscribersBlock(subscribe));
    return httpServer;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = buildServer;
var NotifySubscribersBlock = (function () {
    function NotifySubscribersBlock(socketNamespace) {
        this.socketNamespace = socketNamespace;
        this.name = "Notify Subscribers";
    }
    NotifySubscribersBlock.prototype.process = function (context, request, next) {
        var _this = this;
        var key = Uuid.v4();
        this.socketNamespace.emit("request-head", {
            key: key,
            url: request.url,
            method: request.method
        });
        request.body.on("data", function (data) {
            _this.socketNamespace.emit("request-body", {
                key: key,
                chunk: data
            });
        });
        request.body.on("end", function (data) {
            _this.socketNamespace.emit("request-tail", {
                key: key
            });
        });
        var responsePromise = next(context, request);
        responsePromise.then(function (response) {
            _this.socketNamespace.emit("response-head", {
                key: key,
                statusCode: response.statusCode,
                headers: response.headers
            });
            response.body.on("data", function (data) {
                _this.socketNamespace.emit("response-body", {
                    key: key,
                    chunk: data
                });
                console.log(data);
            });
            response.body.on("end", function (data) {
                _this.socketNamespace.emit("response-tail", {
                    key: key
                });
            });
        });
        return responsePromise;
    };
    NotifySubscribersBlock.prototype.streamToString = function (stream) {
        return new es6_promise_1.Promise(function (resovle, reject) {
            var chunks = [];
            stream.on('data', function (chunk) {
                chunks.push(chunk);
            });
            stream.on('end', function () {
                resovle(chunks.join(''));
            });
        });
    };
    return NotifySubscribersBlock;
}());
//# sourceMappingURL=buildServer.js.map