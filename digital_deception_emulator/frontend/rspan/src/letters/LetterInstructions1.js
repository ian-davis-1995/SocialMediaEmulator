import React from "react";
import "../css/instructions.css";
import InstructionsPage from "../components/InstructionsPage";
import { LetterInstructions1ClickedEvent } from "../events/InstructionsEvents";

export default class LetterInstructions1 extends React.Component {
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
          "In this portion of the experiment you will try to memorize letters you see on the screen while you also read sentences.",
          "In the next few minutes, you will have some practice to get you familiar with how the task works.",
          //   "We will begin by practicing the letter part of the task.",
        ]}
      />
    );
  }

  onInstructionsClicked() {
    this.props.bloc.add(new LetterInstructions1ClickedEvent());
  }
}
