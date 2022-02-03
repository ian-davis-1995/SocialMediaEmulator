import React from "react";
import InstructionsPage from "../components/InstructionsPage";
import { LetterInstructions2ClickedEvent } from "../events/InstructionsEvents";

export default class LetterInstructions2 extends React.Component {
  constructor(props) {
    super(props);

    this.onInstructionsClicked = this.onInstructionsClicked.bind(this);
  }

  render() {
    return (
      <InstructionsPage
        onInstructionsClicked={this.onInstructionsClicked}
        title={""}
        continuePrompt={"Click in this box to continue."}
        paragraphs={[
          "For this practice set, letters will appear on the screen one at a time.",
          "After 2 letters have been shown, you will see a screen listing 12 possible letters.",
          <span>
            Your job is to select each letter in the <b>ORDER PRESENTED</b>. To
            do this, use the mouse to click on the letter. The letters you
            select will appear at the bottom of the screen.
          </span>,
        ]}
      />
    );
  }

  onInstructionsClicked() {
    this.props.bloc.add(new LetterInstructions2ClickedEvent());
  }
}
