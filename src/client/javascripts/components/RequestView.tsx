import * as React from "react";
import LogList from "./LogList";
import {Communication} from "./LogItem";
import {observer} from "mobx-react";
interface RequestViewProps {
    communication:Communication;
}
interface RequestViewState {}

@observer
export default class RequestView extends React.Component<RequestViewProps, RequestViewState>{

    render() {
        let headers = this.props.communication.requestHead.headers;

        return (

            <div className="log-item-request">
            <div className="panel panel-default">
                <div className="panel-heading">Headers</div>
                <table className="table">
                    <tbody>
                    {Object.keys(headers).map(key=>{
                        return <tr>
                            <th>{key}</th>
                            <td>{headers[key]}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>
                </div>
        );
    }
};