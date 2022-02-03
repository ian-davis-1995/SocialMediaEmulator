import React from "react";
import "../css/instructions.css";
import InstructionsPage from "../components/InstructionsPage";
import { CombinedInstructions2ClickedEvent } from "../events/InstructionsEvents";

export default class CombinedInstructions2 extends React.Component {
  constructor(props) {
    super(props);

    this.onInstructionsClicked = this.onInstructionsClicked.bind(this);
  }

  render() {
    return (
      <InstructionsPage
        onInstructionsClicked={this.onInstructionsClicked}
        continuePrompt={"Click in this box to continue."}
        paragraphs={[
          <span>
            After the letter goes away, another sentence will appear, and then
            another letter.
          </span>,
          <span>
            At the end of each set of letters and sentences, a recall screen
            will appear. Use the mouse to select the letters you just saw. Try
            your best to get the letters in the correct order.
          </span>,
          <span>
            It is important to work <b>QUICKLY</b> and <b>ACCURATELY</b> on the
            sentences. Make sure you know whether the sentence makes sense or
            not before clicking to the next screen.
          </span>,
          <span>
            After the recall screen, you will be given feedback about your
            performance regarding both the number of letters recalled and the
            percent correct on the sentence problems.
          </span>,
        ]}
      />
    );
  }

  onInstructionsClicked() {
    this.props.bloc.add(new CombinedInstructions2ClickedEvent());
  }
}
