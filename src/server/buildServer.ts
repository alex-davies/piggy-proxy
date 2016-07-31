import * as http from 'http';
import * as express from 'express';
import {Promise} from 'es6-promise';
import * as events from 'events';
import {Proxy, Request, Response} from "../proxy/Proxy";
import * as path from "path";
import * as ioFactory from "socket.io";
import * as Uuid from "node-uuid";

export default function buildServer(){
    let expressApp = <any>express();

    let proxy = new Proxy();

    expressApp.use(proxy.handleIfProxyRequest.bind(proxy));
    expressApp.use(express.static(path.join(__dirname, '../client')));

    let httpServer = http.createServer(expressApp);
    let io = ioFactory(httpServer);

    //Handle connect (https) requests
    httpServer.on('connect', (req, socket, head)=>{
        console.log('tunnel request from %s:%s', socket.remoteAddress, socket.remotePort);
        proxy.handleConnect(req, socket);
    });

    var subscribe = io.of('/subscribe');

    proxy.blocks.unshift(new NotifySubscribersBlock(subscribe));

    return httpServer;
}

class NotifySubscribersBlock {
    constructor(public socketNamespace:SocketIO.Namespace){

    }

    name:string = "Notify Subscribers";
    process(context:any,
            request:Request,
            next:(context:any, request:Request)=>Promise<Response>):Promise<Response>{

        let key = Uuid.v4();
        this.socketNamespace.emit("request-head", {
            key:key,
            url:request.url,
            method:request.method
        });

        request.body.on("data", data=>{
            this.socketNamespace.emit("request-body", {
                key:key,
                chunk:data
            })
        });

        request.body.on("end", data=>{
            this.socketNamespace.emit("request-tail", {
                key:key
            })
        });


        let responsePromise = next(context, request);

        responsePromise.then(response=>{
            this.socketNamespace.emit("response-head", {
                key:key,
                statusCode:response.statusCode,
                headers:response.headers
            });

            response.body.on("data", data=>{
                this.socketNamespace.emit("response-body", {
                    key:key,
                    chunk:data
                });
                console.log(data);
            });

            response.body.on("end", data=>{
                this.socketNamespace.emit("response-tail", {
                    key:key
                })
            });
        });

        return responsePromise;
    }

    streamToString(stream:NodeJS.ReadableStream):Promise<string>{
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
}



