import * as http from 'http';
import * as express from 'express';
import {Promise} from 'es6-promise';
import * as events from 'events';
import {Proxy, Request, Response} from "../proxy/Proxy";
import * as path from "path";
import * as ioFactory from "socket.io";

import NotifySubscribersBlock from "./NotifySubscribersBlock";

export default function buildServer(){
    let expressApp = <any>express();

    let proxy = new Proxy();

    //we will handle our request with a proxy if it is a proxy request, otherwise we
    //will just serve items out of hte client directory
    expressApp.use(proxy.handleIfProxyRequest.bind(proxy));
    expressApp.use(express.static(path.join(__dirname, '../client')));

    let httpServer = http.createServer(expressApp);

    //Handle connect (https) requests
    httpServer.on('connect', (req, socket, head)=>{
        console.log('tunnel request from %s:%s', socket.remoteAddress, socket.remotePort);
        proxy.handleConnect(req, socket);
    });

    //add in element to proxy pipeline to subscribers of proxied communication
    let io = ioFactory(httpServer);
    var subscribe = io.of('/subscribe');
    proxy.blocks.unshift(new NotifySubscribersBlock(subscribe));

    return httpServer;
}





