"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var LoadingBubbles = (function (_super) {
    __extends(LoadingBubbles, _super);
    function LoadingBubbles() {
        _super.call(this);
        this.state = {};
    }
    LoadingBubbles.prototype.render = function () {
        return (React.createElement("div", {className: "bubblingG"}, React.createElement("span", {className: "bubblingG_1"}), React.createElement("span", {className: "bubblingG_2"}), React.createElement("span", {className: "bubblingG_3"})));
    };
    return LoadingBubbles;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoadingBubbles;
//# sourceMappingURL=LoadingBubbles.js.map