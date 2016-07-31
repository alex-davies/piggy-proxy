"use strict";
var es6_promise_1 = require('es6-promise');
var stream_1 = require('stream');
var Proxy_1 = require('../src/proxy/Proxy');
var assert = require('assert');
function stringToStream(str) {
    var stream = new stream_1.Readable();
    stream._read = function () { };
    stream.push(str);
    stream.push(null);
    return stream;
}
exports.stringToStream = stringToStream;
function streamToString(stream) {
    return new es6_promise_1.Promise(function (resovle, reject) {
        var chunks = [];
        stream.on('data', function (chunk) {
            chunks.push(chunk);
        });
        stream.on('end', function () {
            resovle(chunks.join(''));
        });
    });
}
exports.streamToString = streamToString;
function emptyStream() {
    var stream = new stream_1.Readable();
    stream._read = function () { };
    stream.push(null);
    return stream;
}
exports.emptyStream = emptyStream;
function createRequest(url, method, body) {
    var req = new Proxy_1.Request();
    req.url = url;
    req.method = method || "GET";
    req.body = body === undefined ? req.body = emptyStream()
        : typeof body === "string" ? req.body = stringToStream(body)
            : stringToStream(JSON.stringify(body));
    return req;
}
exports.createRequest = createRequest;
var failProcessingBlock = function (context, pReq) {
    assert.fail("Call should be handled before running out of blocks");
    return es6_promise_1.Promise.reject("Call should be handled before running out of blocks");
};
exports.failProcessingBlock = failProcessingBlock;
//# sourceMappingURL=testUtils.js.map