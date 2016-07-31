import * as io from "socket.io-client";
import App from "./components/App"
import * as React from "react";
import * as ReactDOM from "react-dom";

//setup bootstrap and hack jquery a bit so it works with bootstrap
(global as any).jQuery = require("jquery");
require("bootstrap");


ReactDOM.render(
    <App/>,
    document.getElementById('content')
);



