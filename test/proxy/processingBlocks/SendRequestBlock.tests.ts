import * as nock from 'nock'
import {streamToString, stringToStream, emptyStream, createRequest} from '../../testUtils'
import SendRequestBlock from '../../../src/proxy/processingBlocks/SendRequestBlock';
import * as assert from 'assert';

describe('proxy', function() {

    describe('processingBlocks', function () {

        describe('SendRequestBlock', function () {

            it('should return response from http call', function () {
                var block = new SendRequestBlock();

                var nocks = nock('http://test.test')
                    .get('/')
                    .reply(200, "hello");

                return block.process({}, createRequest("http://test.test"), null)
                    .then((res)=>streamToString(res.body))
                    .then((body)=> assert.equal(body, "hello"))
                    .then(()=>nocks.done());

            });

            it('should send request body', function () {
                var block = new SendRequestBlock();

                var nocks = nock('http://test.test')
                    .post('/')
                    .reply(200, "hello")
                    .filteringRequestBody(function (body) {
                        assert.equal(body, "my-body");
                        return body;
                    });

                return block.process({}, createRequest("http://test.test", "POST", "my-body"), null)
                    .then((res)=>nocks.done());
            });

        });
    });
});

