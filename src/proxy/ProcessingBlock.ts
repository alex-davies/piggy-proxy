import Request from './Request';
import Response from './Response';
import * as Promise from 'es6-promise';

interface ProcessingBlock{
    name:string;
    process(context:any,
            request:Request,
            next:(context:any, request:Request)=>Promise<Response>):Promise<Response>;

}
export default ProcessingBlock;
