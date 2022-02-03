import React from "react";
import InstructionsPage from "../components/InstructionsPage";
import { SentencePracticeStartedEvent } from "../events/SentenceEvents";

export default class SentenceInstructions3 extends React.Component {
  constructor(props) {
    super(props);

    this.onInstructionsClicked = this.onInstructionsClicked.bind(this);
  }

  render() {
    return (
      <InstructionsPage
        onInstructionsClicked={this.onInstructionsClicked}
        continuePrompt={
          "When you're ready, click in this box to try some practice problems."
        }
        paragraphs={[
          //   "It is VERY important that you answer the sentence problems correctly.  ",
          <span>
            It is very important that you try and read the sentences as{" "}
            <b>QUICKLY</b> and as <b>ACCURATELY</b> as possible.
          </span>,
          "Your reading times will be recorded and determine the pace at which sentences are displayed for the duration of the task.",
        ]}
      />
    );
  }

  onInstructionsClicked() {
    this.props.bloc.add(new SentencePracticeStartedEvent());
  }
}
