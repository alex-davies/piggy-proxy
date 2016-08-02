import * as React from "react";
import LogList from "./LogList";
import {Communication} from "./LogItem";
import {observer} from "mobx-react";

interface ResponseViewProps {
    communication:Communication;
}
interface ResponseViewState {}

@observer
export default class ResponseView extends React.Component<ResponseViewProps, ResponseViewState>{

    render() {
        let headers = this.props.communication.responseHead.headers;

        return (

            <div className="log-item-response">
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