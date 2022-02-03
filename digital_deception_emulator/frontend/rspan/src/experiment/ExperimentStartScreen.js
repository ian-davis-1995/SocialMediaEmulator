import React from "react";
import InstructionsPage from "../components/InstructionsPage";
import { ExperimentStartScreenClickedEvent } from "../events/InstructionsEvents";

const autoBind = require("auto-bind");

export default class ExperimentStartScreen extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      secondsLeft: 5,
    };
  }

  componentDidMount() {
    let component = this;
    let timerId = setInterval(function () {
      if (component.state.secondsLeft <= 0) {
        clearInterval(timerId);
      } else {
        component.setState({
          secondsLeft: component.state.secondsLeft - 1,
        });
      }
    }, 1000);
  }

  render() {
    let continueButtonEnabled = this.state.secondsLeft === 0;

    let continueButtonClicked = continueButtonEnabled
      ? this.onInstructionsClicked
      : () => {};

    let continuePrompt = continueButtonEnabled
      ? "Click in this box to continue."
      : `Continue in ${this.state.secondsLeft}`;
    let continueClass = continueButtonEnabled
      ? "instructions-paragraph instructions-continue-prompt"
      : "instructions-paragraph instructions-continue-prompt prompt-disabled";

    return (
      <InstructionsPage
        continueButton={
          <p className={continueClass} onClick={continueButtonClicked}>
            {continuePrompt}
          </p>
        }
        paragraphs={[
          "That is the end of the practice.",
          "The real trials will look like the practice trials you just completed.",
          "First you will get a sentence to read, then a letter to remember.",
          <span>
            When you see the recall screen, select the letters in the order
            presented. If you forget a letter, click the <b>BLANK</b> box to
            mark where it should go.
          </span>,
          " Please do not write letters down, or say them aloud.",
          "Some sets will have more sentences and letters than others.",
          "It is important that you do your best on both the sentence problems and the letter recall parts of this experiment.",
          <span>
            Remember for the sentences you must work as <b>QUICKLY</b> and{" "}
            <b>ACCURATELY</b> (at least 85%) as possible.
          </span>,
          "Please take a small 5 second break, and click the mouse to begin the experiment.",
        ]}
      />
    );
  }

  onInstructionsClicked() {
    this.props.bloc.add(new ExperimentStartScreenClickedEvent());
  }
}
