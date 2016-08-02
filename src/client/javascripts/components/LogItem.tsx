import * as React from "react";
import {observer} from "mobx-react";
import {observable} from 'mobx';
import LoadingBubbles from "./LoadingBubbles";
import * as ReactCSSTransitionGroup  from "react-addons-css-transition-group";
import RequestView from "./RequestView";
import ResponseView from "./ResponseView";

export class Communication{
    @observable requestHead:{
        url:string,
        method:string,
        headers:{[key:string]:string}
    };
    @observable responseHead:{
        statusCode:number,
        headers:{[key:string]:string}
    };
}

export interface LogItemProps {
    communication:Communication
}

enum TabOptions{
    Request = 1,
    Response = 2
}

interface LogItemState {
    openTab?:TabOptions;
}

@observer
export default class LogItem extends React.Component<LogItemProps, LogItemState> {

    constructor(){
        super();
        this.state = {
            openTab:null
        }
    }

    render() {
        let classNames = "log-item-options";
        let tabName = this.state.openTab && TabOptions[this.state.openTab] as string;
        if(tabName)
            classNames += " selected-tab-"+tabName.toLowerCase();

        return (
            <li className="log-item">

                <div className="log-item-header">
                    <div className="log-item-description">
                        <p>{this.props.communication.requestHead.url}</p>
                    </div>


                    <div className={classNames}>
                        <div className="select-line"></div>
                        <ul>
                            <li className="tab-request">
                                <a className="unstyled" onClick={this.optionClickHandler(TabOptions.Request)}>
                                    <span className="tab-detail">{this.props.communication.requestHead.method.toUpperCase()}</span>
                                    <span className="tab-label">Request</span>
                                </a>
                            </li>

                            <li className="tab-response">
                                <a className="unstyled" onClick={this.optionClickHandler(TabOptions.Response)}>
                                    <span className="tab-detail">
                                        <ReactCSSTransitionGroup transitionName="fade-300-300" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                                            {(this.props.communication.responseHead == null)
                                                ? <span key="bubbles" className="tab-detail-center"><LoadingBubbles /></span>
                                                : <span key="code" className="tab-detail-center">{this.props.communication.responseHead.statusCode}</span>}
                                        </ReactCSSTransitionGroup>
                                    </span>
                                    <span className="tab-label">Response</span>
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>

                <ReactCSSTransitionGroup transitionName="fade-300-300" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                {this.state.openTab
                    ?<div className="log-item-body">
                        <ReactCSSTransitionGroup transitionName="fade-300-300" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                        {
                            this.state.openTab === TabOptions.Request ? <RequestView key="requestView" communication={this.props.communication}/>
                            : this.state.openTab === TabOptions.Response ? <ResponseView key="responseView" communication={this.props.communication}/>
                            :null
                        }
                        </ReactCSSTransitionGroup>
                    </div>
                    : null
                }
                </ReactCSSTransitionGroup>








            </li>
        );
    }

    optionClickHandler(option){
        return (e)=>{
            e.preventDefault();
            if(this.state.openTab === option)
                option = 0;

            this.setState({openTab:option})
        }
    }
}


