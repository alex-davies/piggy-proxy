"use strict";
var http = require('http');
var express = require('express');
var Proxy_1 = require("../proxy/Proxy");
var path = require("path");
var ioFactory = require("socket.io");
var NotifySubscribersBlock_1 = require("./NotifySubscribersBlock");
function buildServer() {
    var expressApp = express();
    var proxy = new Proxy_1.Proxy();
    //we will handle our request with a proxy if it is a proxy request, otherwise we
    //will just serve items out of hte client directory
    expressApp.use(proxy.handleIfProxyRequest.bind(proxy));
    expressApp.use(express.static(path.join(__dirname, '../client')));
    var httpServer = http.createServer(expressApp);
    //Handle connect (https) requests
    httpServer.on('connect', function (req, socket, head) {
        console.log('tunnel request from %s:%s', socket.remoteAddress, socket.remotePort);
        proxy.handleConnect(req, socket);
    });
    //add in element to proxy pipeline to subscribers of proxied communication
    var io = ioFactory(httpServer);
    var subscribe = io.of('/subscribe');
    proxy.blocks.unshift(new NotifySubscribersBlock_1.default(subscribe));
    return httpServer;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = buildServer;
//# sourceMappingURL=buildServer.js.map