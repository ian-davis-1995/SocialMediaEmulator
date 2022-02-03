import React from "react";
import InstructionsPage from "../components/InstructionsPage";
import { LetterPracticeStartedEvent } from "../events/LetterEvents";

export default class LetterInstructions3 extends React.Component {
  constructor(props) {
    super(props);

    this.onInstructionsClicked = this.onInstructionsClicked.bind(this);
  }

  render() {
    return (
      <InstructionsPage
        onInstructionsClicked={this.onInstructionsClicked}
        continuePrompt={
          "When you're ready, click in this box to start the letter practice."
        }
        title={""}
        paragraphs={[
          <span>
            When you have selected all the letters, and they are in the correct
            order, hit the <b>SUBMIT</b> box at the bottom right of the screen.
          </span>,
          <span>
            If you make a mistake, hit the <b>CLEAR</b> box to start over.
          </span>,
          <span>
            If you forget one of the letters, click the <b>BLANK</b> box to mark
            the spot for the missing letter.
          </span>,
          "Remember, it is very important to get the letters in the same order as you see them.",
        ]}
      />
    );
  }

  onInstructionsClicked() {
    this.props.bloc.add(new LetterPracticeStartedEvent());
  }
}
