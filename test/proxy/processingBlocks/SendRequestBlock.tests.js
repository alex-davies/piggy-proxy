"use strict";
var nock = require('nock');
var testUtils_1 = require('../../testUtils');
var SendRequestBlock_1 = require('../../../src/proxy/processingBlocks/SendRequestBlock');
var assert = require('assert');
describe('proxy', function () {
    describe('processingBlocks', function () {
        describe('SendRequestBlock', function () {
            it('should return response from http call', function () {
                var block = new SendRequestBlock_1.default();
                var nocks = nock('http://test.test')
                    .get('/')
                    .reply(200, "hello");
                return block.process({}, testUtils_1.createRequest("http://test.test"), null)
                    .then(function (res) { return testUtils_1.streamToString(res.body); })
                    .then(function (body) { return assert.equal(body, "hello"); })
                    .then(function () { return nocks.done(); });
            });
            it('should send request body', function () {
                var block = new SendRequestBlock_1.default();
                var nocks = nock('http://test.test')
                    .post('/')
                    .reply(200, "hello")
                    .filteringRequestBody(function (body) {
                    assert.equal(body, "my-body");
                    return body;
                });
                return block.process({}, testUtils_1.createRequest("http://test.test", "POST", "my-body"), null)
                    .then(function (res) { return nocks.done(); });
            });
        });
    });
});
//# sourceMappingURL=SendRequestBlock.tests.js.map