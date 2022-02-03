import React from "react";
import InstructionsPage from "../components/InstructionsPage";
import { SentenceInstructions2ClickedEvent } from "../events/InstructionsEvents";

export default class SentenceInstructions2 extends React.Component {
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
            You will then see "This sentence makes sense." displayed on the next
            screen, along with a box marked <b>TRUE</b> and a box marked{" "}
            <b>FALSE</b>.
          </span>,
          <span>
            If the sentence on the previous screen made sense, click on the{" "}
            <b>TRUE</b> box with the mouse.
          </span>,
          <span>
            If the sentence did not make sense, click on the <b>FALSE</b> box.
          </span>,
          "After you click on one of the boxes, the computer will tell you if you made the right choice.",
        ]}
      />
    );
  }

  onInstructionsClicked() {
    this.props.bloc.add(new SentenceInstructions2ClickedEvent());
  }
}
