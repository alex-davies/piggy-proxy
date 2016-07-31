import Request from '../Request';
import Response from '../Response';
import * as Promise from 'es6-promise';
import * as http from 'http';
import ProcessingBlock from '../ProcessingBlock';


class MultiBlock extends Array<ProcessingBlock> implements ProcessingBlock{
    name = "decrypt secure connection"
    blocks: ProcessingBlock[];

    constructor(blocks: ProcessingBlock[]){
        super();
        this.push.apply(this, blocks);
        //this.blocks = blocks;
    }

    process(context:any,
            pReq:Request,
            next:(context:any, request:Request)=>Promise<Response>):Promise<Response> {

                console.log(this[0].name);
                return this.generateNextFunc(0, next)(context, pReq);
    }

    /**
     * Generates a function that will call process on the i'th block, filling in the next function
     * @param i
     * @param endOfBlocksNextFunc - next function to use when we run out of blocks,
     * allows for chaining multiple MultiProcessingBLocks
     * @returns {function(any, PiggyRequestWrap): Promise<PiggyResponseWrap>}
     */
    private generateNextFunc(i:number, endOfBlocksNextFunc:(context:any, request:Request)=>Promise<Response>){
        i = i || 0;
        var self = this;
        return function(context:any, pReq:Request):Promise<Response>{
            if(self.length > i){
                return self[i].process(context, pReq, self.generateNextFunc(i+1, endOfBlocksNextFunc))
            }
            return endOfBlocksNextFunc(context, pReq);
        }
    }
}

export default MultiBlock