"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require("events");
var makeRequest = require('request');
var RequestEmitterBlock = (function (_super) {
    __extends(RequestEmitterBlock, _super);
    function RequestEmitterBlock(tag, emitter) {
        _super.call(this);
        this.tag = tag;
        this.name = "Perform Call";
        this.emitter = emitter || this;
    }
    RequestEmitterBlock.prototype.process = function (context, pReq, next) {
        this.emitter.emit('request', this.tag, context, pReq);
        return next(context, pReq);
    };
    return RequestEmitterBlock;
}(events_1.EventEmitter));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RequestEmitterBlock;
//# sourceMappingURL=RequestEmitterBlock.js.map