import React from "react";
import "../css/instructions.css";
import InstructionsPage from "../components/InstructionsPage";
import { CombinedInstructions1ClickedEvent } from "../events/InstructionsEvents";

export default class CombinedInstructions1 extends React.Component {
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
            Now you will practice doing <b>BOTH</b> parts of the task at the
            same time.
          </span>,
          <span>
            In the next practice set, you will be given one sentence to read.
            Once you make your decision about the sentence, a letter will appear
            on the screen. Try and remember the letter.
          </span>,
          <span>
            In the previous section where you only read the sentences, the
            computer computed your average time to read the sentences. If you
            take longer than your average time, the computer will automatically
            move you onto the letter part, thus skipping the True or False part
            and will count that problem as a sentence error.
          </span>,
          <span>
            Therefore it is very important to read the sentences as
            <b> QUICKLY</b> and as <b>ACCURATELY</b> as possible.
          </span>,
        ]}
      />
    );
  }

  onInstructionsClicked() {
    this.props.bloc.add(new CombinedInstructions1ClickedEvent());
  }
}
