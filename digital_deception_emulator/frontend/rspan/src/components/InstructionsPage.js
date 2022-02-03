import React from "react";

export default function InstructionsPage(props) {
  let paragraphs = [];

  for (let i = 0; i < props.paragraphs.length; i++) {
    paragraphs.push(
      <p
        className={"instructions-paragraph"}
        id={"instruction-paragraph-" + i}
        key={i}
      >
        {props.paragraphs[i]}
      </p>
    );
  }

  let continuePrompt = "";
  let containerOnClick = () => {};

  if (props.continueButton !== undefined && props.continueButton !== null) {
    continuePrompt = props.continueButton;
  } else if (
    props.continuePrompt !== undefined &&
    props.continuePrompt !== null
  ) {
    continuePrompt = (
      <p
        className={"instructions-paragraph instructions-continue-prompt"}
        onClick={props.onInstructionsClicked}
      >
        {props.continuePrompt}
      </p>
    );
  } else {
    containerOnClick = props.onInstructionsClicked;
  }

  let title = "";

  if (props.title !== undefined && props.title !== null && props.title !== "") {
    title = <h1 className={"instructions-title"}>{props.title}</h1>;
  }

  return (
    <div
      className={"instructions-container fullscreen-centered-container"}
      id={"practice-letter-instructions-container"}
      onClick={containerOnClick}
    >
      {title}
      {paragraphs}
      {continuePrompt}
    </div>
  );
}
