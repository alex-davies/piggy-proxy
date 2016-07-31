import Request from '../Request';
import Response from '../Response';
import {Promise} from 'es6-promise';
import * as http from 'http';
import ProcessingBlock from '../ProcessingBlock';
import * as Url from 'url';
import * as makeRequest from 'request';

class SendRequestBlock implements ProcessingBlock{
    name = "Perform Call"
    process(context:any,
            pReq:Request,
            next:(context:any, request:Request)=>Promise<Response>):Promise<Response>{

        return new Promise<Response>((resolve, reject) => {


            var externalRequest = makeRequest(pReq.url, {
                method:pReq.method,
                headers:pReq.headers
            }).on('response', (res) => {
                context.proxyResponse = res;
                var pRes = Response.fromIncomingMessage(res);
                resolve(pRes);
            }).on('error', (err)=> {
                reject(err);
            });
            pReq.body.pipe(externalRequest);
        });

    }
}

export default SendRequestBlock;