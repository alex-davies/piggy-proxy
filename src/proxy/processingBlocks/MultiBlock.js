"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MultiBlock = (function (_super) {
    __extends(MultiBlock, _super);
    function MultiBlock(blocks) {
        _super.call(this);
        this.name = "decrypt secure connection";
        this.push.apply(this, blocks);
        //this.blocks = blocks;
    }
    MultiBlock.prototype.process = function (context, pReq, next) {
        console.log(this[0].name);
        return this.generateNextFunc(0, next)(context, pReq);
    };
    /**
     * Generates a function that will call process on the i'th block, filling in the next function
     * @param i
     * @param endOfBlocksNextFunc - next function to use when we run out of blocks,
     * allows for chaining multiple MultiProcessingBLocks
     * @returns {function(any, PiggyRequestWrap): Promise<PiggyResponseWrap>}
     */
    MultiBlock.prototype.generateNextFunc = function (i, endOfBlocksNextFunc) {
        i = i || 0;
        var self = this;
        return function (context, pReq) {
            if (self.length > i) {
                return self[i].process(context, pReq, self.generateNextFunc(i + 1, endOfBlocksNextFunc));
            }
            return endOfBlocksNextFunc(context, pReq);
        };
    };
    return MultiBlock;
}(Array));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MultiBlock;
//# sourceMappingURL=MultiBlock.js.map