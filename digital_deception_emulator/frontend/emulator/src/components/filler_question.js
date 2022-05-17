import React from "react";
import "../css/filler_question.css";

export default function FillerQuestion(props) {
  return (
    <div
      className={"filler-question-container"}
      id={`${props.id}-filler-question`}
    >
      <p
        id={`${props.id}-filler-question-text`}
        className={"filler-question-text"}
      >
        You have finished reading this excerpt. Please click the arrow to
        continue.
      </p>
      <div
        className={"filler-question-next-button-container"}
        id={`${props.id}-filler-question-next-button-container`}
      >
        <button
          id={`${props.id}-filler-question-next-button`}
          className={"filler-question-next-button"}
          onClick={props.onContinueClicked}
        >
          →
        </button>
      </div>
    </div>
  );
}
