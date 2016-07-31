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
var mobx_1 = require('mobx');
var LoadingBubbles_1 = require("./LoadingBubbles");
var ReactCSSTransitionGroup = require("react-addons-css-transition-group");
var Communication = (function () {
    function Communication() {
    }
    __decorate([
        mobx_1.observable
    ], Communication.prototype, "requestHead", void 0);
    __decorate([
        mobx_1.observable
    ], Communication.prototype, "responseHead", void 0);
    return Communication;
}());
exports.Communication = Communication;
var LogItem = (function (_super) {
    __extends(LogItem, _super);
    function LogItem() {
        _super.call(this);
        this.state = {
            selectedOption: 0
        };
    }
    LogItem.prototype.render = function () {
        var classNames = "log-item-options";
        if (this.state.selectedOption)
            classNames += " selected-option-" + this.state.selectedOption;
        return (React.createElement("li", {className: "log-item"}, React.createElement("div", {className: "log-item-description"}, React.createElement("p", null, this.props.communication.requestHead.url)), React.createElement("div", {className: classNames}, React.createElement("div", {className: "select-line"}), React.createElement("ul", null, React.createElement("li", {className: "option-1"}, React.createElement("a", {className: "unstyled", onClick: this.optionClickHandler(1)}, React.createElement("span", {className: "option-detail"}, this.props.communication.requestHead.method.toUpperCase()), React.createElement("span", {className: "option-label"}, "Request"))), React.createElement("li", {className: "option-2"}, React.createElement("a", {className: "unstyled", onClick: this.optionClickHandler(2)}, React.createElement("span", {className: "option-detail"}, React.createElement(ReactCSSTransitionGroup, {transitionName: "fade-300-300", transitionEnterTimeout: 300, transitionLeaveTimeout: 300}, (this.props.communication.responseHead == null)
            ? React.createElement("span", {key: "bubbles", className: "option-detail-center"}, React.createElement(LoadingBubbles_1.default, null))
            : React.createElement("span", {key: "code", className: "option-detail-center"}, this.props.communication.responseHead.statusCode))), React.createElement("span", {className: "option-label"}, "Response")))))));
    };
    LogItem.prototype.optionClickHandler = function (option) {
        var _this = this;
        return function (e) {
            e.preventDefault();
            if (_this.state.selectedOption === option)
                option = 0;
            _this.setState({ selectedOption: option });
        };
    };
    LogItem = __decorate([
        mobx_react_1.observer
    ], LogItem);
    return LogItem;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LogItem;
//# sourceMappingURL=LogItem.js.map