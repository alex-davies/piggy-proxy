"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var React = require("react");
var mobx_react_1 = require("mobx-react");
var RequestView = (function (_super) {
    __extends(RequestView, _super);
    function RequestView() {
        _super.apply(this, arguments);
    }
    RequestView.prototype.render = function () {
        var headers = this.props.communication.requestHead.headers;
        return (React.createElement("div", {className: "log-item-request"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-heading"}, "Headers"), React.createElement("table", {className: "table"}, React.createElement("tbody", null, Object.keys(headers).map(function (key) {
            return React.createElement("tr", null, React.createElement("th", null, key), React.createElement("td", null, headers[key]));
        }))))));
    };
    RequestView = __decorate([
        mobx_react_1.observer
    ], RequestView);
    return RequestView;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RequestView;
;
//# sourceMappingURL=RequestView.js.map