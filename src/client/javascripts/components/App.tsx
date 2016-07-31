import * as React from "react";
import LogList from "./LogList";
interface AppProps {}
interface AppState {}

export default class App extends React.Component<AppProps, AppState>{

    render() {
        return (
            <LogList />
        );
    }
};