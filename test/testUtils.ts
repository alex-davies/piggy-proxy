import {Promise} from 'es6-promise';
import {Readable} from 'stream'
import {Proxy, Request, Response} from '../src/proxy/Proxy';
import * as assert from 'assert';

function stringToStream(str:string){
    var stream = new Readable();
    stream._read= ()=>{};
    stream.push(str);
    stream.push(null);
    return stream;
}

function streamToString(stream:NodeJS.ReadableStream):Promise<string>{
    return new Promise((resovle,reject)=>{
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        stream.on('end', () => {
            resovle(chunks.join(''));
        });
    })
}

function emptyStream(){
    var stream = new Readable();
    stream._read= ()=>{};
    stream.push(null);
    return stream;
}

function createRequest(url:string, method?:string, body?:string|Object){
    var req = new Request();
    req.url = url;
    req.method = method || "GET";
    req.body = body === undefined ? req.body = emptyStream()
        : typeof body === "string" ? req.body = stringToStream(body)
        : stringToStream(JSON.stringify(body));
    return req;
}

var failProcessingBlock = function(context:any,pReq:Request):Promise<Response>{
    assert.fail("Call should be handled before running out of blocks");
    return Promise.reject("Call should be handled before running out of blocks");
}

export {stringToStream, streamToString, emptyStream, createRequest, failProcessingBlock}
