"use strict";
var App_1 = require("./components/App");
var React = require("react");
var ReactDOM = require("react-dom");
//setup bootstrap and hack jquery a bit so it works with bootstrap
global.jQuery = require("jquery");
require("bootstrap");
ReactDOM.render(React.createElement(App_1.default, null), document.getElementById('content'));
//# sourceMappingURL=main.js.map