import React from "react";
import {SensePromptRespondedEvent} from "../events/SentenceEvents";


export default class SentenceMakesSensePrompt extends React.Component {
    constructor(props) {
        super(props);

        this.onResponseGiven = this.onResponseGiven.bind(this);
        this.state = {
            currentResponse: null,
        };
    }

    render() {
        let feedback = <div id={"feedback-container"}/>;

        if (this.props.showingFeedback) {
            console.debug("Showing feedback");
            feedback = <div id={"feedback-container"}>
                <span className={"feedback-span"}>{this.props.response === this.props.expectedResponse ? "CORRECT" : "INCORRECT"}</span>
            </div>;
        }

        let falseButtonClass = "btn primary sentence-makes-sense-button";
        let trueButtonClass = "btn primary sentence-makes-sense-button";

        if (this.state.currentResponse === true) {
            trueButtonClass += " active";
        } else if (this.state.currentResponse === false) {
            falseButtonClass += " active";
        }

        return (
            <div id={"sentence-makes-sense-container"} className={"fullscreen-centered-container"}>
                <div id={"sentence-makes-sense-box"}>
                    <p className={"sentence-makes-sense-paragraph"}>
                        This sentence makes sense.
                    </p>
                    <br/>
                    {feedback}
                    <div id={"sentence-makes-sense-button-row"}>
                        <button
                            className={trueButtonClass}
                            onClick={() => this.setState({currentResponse: true})}>TRUE</button>
                        <button
                            className={falseButtonClass}
                            onClick={() => this.setState({currentResponse: false})}>FALSE</button>
                    </div>
                    <div id={"sentence-makes-sense-button-row"}>
                        <button className={"btn primary sentence-makes-sense-button"}
                                onClick={() => this.onResponseGiven()}>
                            NEXT
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    onResponseGiven() {
        if (this.state.currentResponse === null) {
            alert("Please select either true or false");
            return;
        }

        this.props.bloc.add(
            new SensePromptRespondedEvent(
                this.props.sentence,
                this.props.expectedResponse,
                this.state.currentResponse,
                this.props.readingTimeMillis,
            ),
        );
    }
}
