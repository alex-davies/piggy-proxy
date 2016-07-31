import * as React from "react";
export default class LoadingBubbles extends React.Component<{}, {}> {

    constructor() {
        super();
        this.state = {}
    }

    render() {
        return (
            <div className="bubblingG">
                <span className="bubblingG_1"></span>
                <span className="bubblingG_2"></span>
                <span className="bubblingG_3"></span>
            </div>
        );
    }
}