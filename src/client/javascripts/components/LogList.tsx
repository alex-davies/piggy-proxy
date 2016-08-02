import * as io from "socket.io-client";
import * as React from "react";
import LogItem from "./LogItem";
import {Communication} from "./LogItem";


interface LogListProps {}

interface LogListState {
    logItemElements:JSX.Element[]; //a bit unorthodox, but makes update so much faster to store them as JSX elements
    communicationIndex:{[key:string]:Communication}
    subscription:SocketIOClient.Socket
}

export default class LogList extends React.Component<LogListProps, LogListState> {


    constructor(props : LogListProps, context) {
        super(props,context);
        this.state = {
            subscription:null,
            logItemElements:[],
            communicationIndex:{}
        }
    }

    render() {
        return (
                <ul className="list-group">
                    {this.state.logItemElements}
                </ul>
        );
    }
    componentDidMount(){
        this.state.subscription = io.connect("/subscribe");
        this.state.subscription.on('connect', ()=>{


            this.state.subscription.on("request-head", (data)=> {


                this.setState((state,props)=>{

                    let communication = new Communication();
                    communication.requestHead = {
                        url: data.url,
                        method: data.method,
                        headers: data.headers as {[key:string]:string}
                    };

                    state.communicationIndex[data.key] = communication;
                    state.logItemElements.unshift( <LogItem key={data.key} communication={communication}/>);
                    return state;
                })
            });

            this.state.subscription.on("request-body", (data)=> {

            });

            this.state.subscription.on("request-tail", (data)=> {

            });


            this.state.subscription.on("response-head", (data)=> {
                let communication = this.state.communicationIndex[data.key];
                if(!communication)
                    return;
                communication.responseHead = {
                    statusCode: data.statusCode,
                    headers: data.headers as {[key:string]:string}
                };
            });

            this.state.subscription.on("response-body", (data)=> {

            });
            this.state.subscription.on("response-tail", (data)=> {

            });
        });
    }
    componentWillUnmount(){
        if(this.state.subscription)
            this.state.subscription.disconnect();
    }


}


