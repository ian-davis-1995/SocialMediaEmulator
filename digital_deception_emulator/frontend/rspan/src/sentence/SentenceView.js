import React from "react";
import {SentenceReadEvent, SentenceTimeoutEvent} from "../events/SentenceEvents";


export default class SentenceView extends React.Component {
    constructor(props) {
        super(props);

        this.onSentenceTimeout = this.onSentenceTimeout.bind(this);
        this.onSentenceClicked = this.onSentenceClicked.bind(this);
        this.readingStartTime = null;
        this.timeoutHandle = 0;
    }

    componentDidMount() {
        this.readingStartTime = new Date().getTime();

        if (this.props.maxReadingTime !== undefined && this.props.maxReadingTime !== -1) {
            this.timeoutHandle = setTimeout(this.onSentenceTimeout, this.props.maxReadingTime);
        }
    }

    render() {
        return (
            <div id={"sentence-view-container"}
                 onClick={this.onSentenceClicked} className={"fullscreen-centered-container"}>
                <h1>
                    {this.props.sentence}
                </h1>
                <br/>
                <p id={"sentence-view-directions"}>
                    When you have read the sentence, click the mouse to continue.
                </p>
            </div>
        );
    }

    onSentenceClicked() {
        let readingTimeMillis = new Date().getTime() - this.readingStartTime;

        if (this.timeoutHandle !== 0) {
            clearTimeout(this.timeoutHandle);
        }

        if (readingTimeMillis < 750) {
            alert("Too Fast! Please Ensure you read the sentence fully before clicking.");
            return;
        }

        this.props.bloc.add(new SentenceReadEvent(this.props.sentence, this.props.expectedResponse, readingTimeMillis));
    }

    onSentenceTimeout() {
        this.props.bloc.add(new SentenceTimeoutEvent(this.props.sentence, this.props.expectedResponse));
    }
}
