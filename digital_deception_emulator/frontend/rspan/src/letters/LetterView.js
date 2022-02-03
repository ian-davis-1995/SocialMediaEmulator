import React from "react";

export default class LetterView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: true,
        };
    }

    render() {
        return (
            <div className={"fullscreen-centered-container"}
                 id={"letter-view-container"}
                 style={this.state.visible ? {} : {"display": "none"}}>
                <div id={"letter-view-box"}>
                    {this.props.letter}
                </div>
            </div>
        );
    }
}
