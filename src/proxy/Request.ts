import * as http from 'http';


class Request {
    method:string;
    url:string;
    httpVersion:string;
    headers:any;
    body:NodeJS.ReadableStream;


    static fromIncomingMessage(message:http.IncomingMessage){
        var pReq = new Request();
        pReq.headers = message.headers;
        pReq.method = message.method;
        pReq.url = message.url;
        pReq.httpVersion = message.httpVersion;
        pReq.body = message;
        return pReq;
    }
}

export default Request
