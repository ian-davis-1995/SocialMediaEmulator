import React from "react";
import "../css/instructions.css";
import InstructionsPage from "../components/InstructionsPage";
import { CombinedInstructions3ClickedEvent } from "../events/InstructionsEvents";

export default class CombinedInstructions3 extends React.Component {
  constructor(props) {
    super(props);

    this.onInstructionsClicked = this.onInstructionsClicked.bind(this);
  }

  render() {
    return (
      <InstructionsPage
        onInstructionsClicked={this.onInstructionsClicked}
        continuePrompt={"Click in this box to try some practice problems."}
        paragraphs={[
          <span>
            During the feedback, you will see a number in{" "}
            <span style={{ color: "red" }}>RED</span> in the top right of the
            screen.
          </span>,
          <span>
            This indicates your percent correct for the sentence problems for
            the entire experiment.
          </span>,
          <span>
            For our purposes, we can only use data where the participant was
            <b> AT LEAST 85%</b> accurate on the sentences.
          </span>,
          <span>
            Therefore, try to perform <b> AT LEAST 85%</b> on the sentence
            problems while doing your best to recall AS MANY LETTERS as
            possible.
          </span>,
        ]}
      />
    );
  }

  onInstructionsClicked() {
    this.props.bloc.add(new CombinedInstructions3ClickedEvent());
  }
}
