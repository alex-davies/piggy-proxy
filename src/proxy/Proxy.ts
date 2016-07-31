import Request from './Request';
import Response from './Response';
import DecryptTLSProcessingBlock from './processingBlocks/TunnellingBlock';
import PerformCallProcessingBlock from './processingBlocks/SendRequestBlock';
import MultiProcessingBlock from './processingBlocks/MultiBlock';
import {Promise} from 'es6-promise';
import * as http from 'http';
import * as net from 'net';
import * as events from 'events';
import ProcessingBlock from './ProcessingBlock';
import * as Url from 'url';


export default class Proxy{
    static newline = '\r\n';
    static rejectRequest = (context,pReq)=>Promise.reject("There are no more blocks to process");

    private self = this;

    public blocks:MultiProcessingBlock = new MultiProcessingBlock([
        new DecryptTLSProcessingBlock(),
        new PerformCallProcessingBlock(),
    ]);

    constructor(){

    }

    handleIfProxyRequest(request:http.IncomingMessage, response:http.ServerResponse, next){
        let isProxyRequest = request.url.indexOf("/") !== 0;
        if(isProxyRequest) {
            this.handleRequest(request, response);
        }
        else {
            next();
        }
    }

    handleRequest(request:http.IncomingMessage, response:http.ServerResponse){
        var context:any = {
            originalRequest: request,
            originResponse: response
        };

        var pReq = Request.fromIncomingMessage(request);

        this.blocks.process(context, pReq, Proxy.rejectRequest).then(pRes=>{
            //write our response out
            response.writeHead(pRes.statusCode, pRes.headers);
            pRes.body.pipe(response);
        }).catch(function(ex){
            //write out bad gateway error
            console.error(ex);
            response.writeHead(502);
            response.end();
        });
    }

    handleConnect(request:http.IncomingMessage, socket:any){
        var context:any = {
            originalRequest : request,
            originResponse : socket,
        };

        var pReq = Request.fromIncomingMessage(request);
        pReq.body = socket; //our body is from the socket in this case


        var hasOutputStarted = false;
        this.blocks.process(context, pReq, Proxy.rejectRequest).then(pRes=>{
            hasOutputStarted = true;
            if(pRes.statusCode == 200){
                //write out the header manually as we have to use the raw socket
                socket.write('HTTP/1.1 200 Connection established'+Proxy.newline+Proxy.newline);

                //pipe out everything in our socket, this will be the 'encrypted' traffic
                pRes.body.pipe(socket);
            }
            else{
                var statusCode = pRes.statusCode;
                var statusMessage = http.STATUS_CODES[statusCode];
                socket.write('HTTP/1.1 ');
                socket.write(statusCode);
                socket.write(' ');
                socket.write(statusMessage);
                socket.write(Proxy.newline+Proxy.newline);
                socket.end();
            }
        }).catch(function(ex){
            console.error(ex);
            if(!hasOutputStarted && socket.writable)
                socket.write('HTTP/1.1 502 Bad gateway');
            socket.end();
        });
    }
}

export {Proxy, Request, Response, ProcessingBlock, MultiProcessingBlock}
