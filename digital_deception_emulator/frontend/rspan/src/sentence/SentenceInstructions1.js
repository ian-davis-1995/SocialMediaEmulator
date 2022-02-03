import React from "react";
import InstructionsPage from "../components/InstructionsPage";
import { SentenceInstructions1ClickedEvent } from "../events/InstructionsEvents";

export default class SentenceInstructions1 extends React.Component {
  constructor(props) {
    super(props);

    this.onInstructionsClicked = this.onInstructionsClicked.bind(this);
  }

  render() {
    return (
      <InstructionsPage
        onInstructionsClicked={this.onInstructionsClicked}
        continuePrompt={"Click in this box to continue."}
        title={"INSTRUCTIONS"}
        paragraphs={[
          "Now you will practice doing the sentence reading part of the task.",
          "A sentence will appear on the screen, like this:",
          '"I like to run in the park."',
          "As soon as you see the sentence, you should read it and determine if it makes sense or not.",
          "The above sentence makes sense.",
          "When you have read the sentence and determined whether it makes sense or not, you will click the mouse button.",
        ]}
      />
    );
  }

  onInstructionsClicked() {
    this.props.bloc.add(new SentenceInstructions1ClickedEvent());
  }
}
