"use strict";
var Uuid = require("node-uuid");
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
        return new Promise(function (resovle, reject) {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NotifySubscribersBlock;
//# sourceMappingURL=NotifySubscribersBlock.js.map