import * as http from 'http';

class Response
{
    statusCode:number;
    headers:any;
    body:NodeJS.ReadableStream;

    static fromIncomingMessage(message:http.IncomingMessage){
        var pRes = new Response();
        pRes.statusCode = message.statusCode;
        pRes.headers = message.headers;
        pRes.body = message;
        return pRes;
    }
}
export default Response;
