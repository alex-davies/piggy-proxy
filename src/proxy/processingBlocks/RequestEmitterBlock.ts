import Request from '../Request';
import Response from '../Response';
import {Promise} from 'es6-promise';
import * as http from 'http';
import ProcessingBlock from '../ProcessingBlock';
import * as Url from 'url';
import {EventEmitter} from "events"
var makeRequest = require('request');

class RequestEmitterBlock extends EventEmitter implements ProcessingBlock{
    name = "Perform Call"
    emitter:EventEmitter;

    constructor(private tag:string, emitter?:EventEmitter){
        super();
        this.emitter = emitter || this;
    }

    process(context:any,
            pReq:Request,
            next:(context:any, request:Request)=>Promise<Response>):Promise<Response>{

        this.emitter.emit('request', this.tag, context, pReq)

        return next(context, pReq);

    }
}

export default RequestEmitterBlock;