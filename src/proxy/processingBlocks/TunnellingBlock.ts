import Request from '../Request';
import Response from '../Response';
import {Promise} from 'es6-promise';
import * as http from 'http';
import * as net from 'net';
import ProcessingBlock from '../ProcessingBlock';


class TunnellingBlock implements ProcessingBlock {
    name = "decrypt secure connection"
    process(context:any,
            pReq:Request,
            next:(context:any, request:Request)=>Promise<Response>):Promise<Response> {

        if(pReq.method.toUpperCase() === "CONNECT"){
            return new Promise<Response>(function(resolve, reject){
                var spliturl = pReq.url.split(':');
                var tunnelPort = spliturl.length < 2 ? 443 : parseInt(spliturl[1]);
                var tunnelHost = spliturl[0];

                // var proxySocket = new net.Socket({
                //     readable: true,
                //     writable: true
                // });
                var proxySocket = new net.Socket();

                proxySocket.connect(tunnelPort, tunnelHost, function() {
                    var pRes = new Response();
                    pRes.statusCode = 200;
                    pRes.body = proxySocket;
                    pReq.body.pipe(proxySocket);
                    resolve(pRes);
                });
                proxySocket.on('error', function(er) {
                    reject(er);
                });
            })
        }

        return next(context, pReq);
    }
}

export default TunnellingBlock