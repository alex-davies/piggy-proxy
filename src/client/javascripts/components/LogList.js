"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var io = require("socket.io-client");
var React = require("react");
var LogItem_1 = require("./LogItem");
var LogItem_2 = require("./LogItem");
var LogList = (function (_super) {
    __extends(LogList, _super);
    function LogList(props, context) {
        _super.call(this, props, context);
        this.state = {
            subscription: null,
            logItemElements: [],
            communicationIndex: {}
        };
    }
    LogList.prototype.render = function () {
        return (React.createElement("ul", {className: "list-group"}, this.state.logItemElements));
    };
    LogList.prototype.componentDidMount = function () {
        var _this = this;
        console.log(this);
        this.state.subscription = io.connect("/subscribe");
        this.state.subscription.on('connect', function () {
            _this.state.subscription.on("request-head", function (data) {
                _this.setState(function (state, props) {
                    var communication = new LogItem_2.Communication();
                    communication.requestHead = {
                        url: data.url,
                        method: data.method,
                        headers: {}
                    };
                    state.communicationIndex[data.key] = communication;
                    state.logItemElements.unshift(React.createElement(LogItem_1.default, {key: data.key, communication: communication}));
                    return state;
                });
            });
            _this.state.subscription.on("request-body", function (data) {
            });
            _this.state.subscription.on("request-tail", function (data) {
            });
            _this.state.subscription.on("response-head", function (data) {
                var communication = _this.state.communicationIndex[data.key];
                if (!communication)
                    return;
                communication.responseHead = {
                    statusCode: data.statusCode,
                    headers: {}
                };
            });
            _this.state.subscription.on("response-body", function (data) {
            });
            _this.state.subscription.on("response-tail", function (data) {
            });
        });
    };
    LogList.prototype.componentWillUnmount = function () {
        if (this.state.subscription)
            this.state.subscription.disconnect();
    };
    return LogList;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LogList;
//# sourceMappingURL=LogList.js.map