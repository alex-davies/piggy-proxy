import * as React from "react";
import {observer} from "mobx-react";
import {observable} from 'mobx';
import LoadingBubbles from "./LoadingBubbles";
import * as ReactCSSTransitionGroup  from "react-addons-css-transition-group";

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

interface LogItemState {
    selectedOption;
}

@observer
export default class LogItem extends React.Component<LogItemProps, LogItemState> {

    constructor(){
        super();
        this.state = {
            selectedOption:0
        }
    }

    render() {
        let classNames = "log-item-options";
        if(this.state.selectedOption)
            classNames += " selected-option-"+this.state.selectedOption;

        return (
            <li className="log-item">

                <div className="log-item-description">
                    <p>{this.props.communication.requestHead.url}</p>
                </div>


                <div className={classNames}>
                    <div className="select-line"></div>
                    <ul>
                        <li className="option-1">
                            <a className="unstyled" onClick={this.optionClickHandler(1)}>
                                <span className="option-detail">{this.props.communication.requestHead.method.toUpperCase()}</span>
                                <span className="option-label">Request</span>
                            </a>
                        </li>
                        <li className="option-2">
                            <a className="unstyled" onClick={this.optionClickHandler(2)}>
                                <span className="option-detail">
                                    <ReactCSSTransitionGroup transitionName="fade-300-300" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                                        {(this.props.communication.responseHead == null)
                                            ? <span key="bubbles" className="option-detail-center"><LoadingBubbles /></span>
                                            : <span key="code" className="option-detail-center">{this.props.communication.responseHead.statusCode}</span>}
                                    </ReactCSSTransitionGroup>
                                </span>
                                <span className="option-label">Response</span>
                            </a>
                        </li>
                    </ul>

                </div>
            </li>
        );
    }

    optionClickHandler(option){
        return (e)=>{
            e.preventDefault();
            if(this.state.selectedOption === option)
                option = 0;

            this.setState({selectedOption:option})
        }
    }
}


