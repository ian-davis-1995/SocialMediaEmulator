import React from "react";
import "../css/distractions/multi-choice-image.css";

export function MultiChoiceImage(props) {
    let questions = [];

    for (let i=0; i < props.answers.length; i++) {
        let answer = props.answers[i];
        let answerText = answer.text;
        let className = "answer-container";

        if (answerText === props.currentAnswer) {
            className += " active";
        }

        questions.push(
            <span className={className}
                  id={`${props.id}-answer-${i}`}
                  key={i}
                  onClick={function() {
                props.onAnswerChanged(props.id, answerText);
            }}>
                <label id={`${props.id}-answer-${i}-label`}
                       htmlFor={`answers-${i}`}
                       className={"multiple-choice-image-answer"}>
                    <span>{answerText}</span>
                </label>
            </span>);
    }

    return (
      <div id={`${props.id}-container`} className={"multi-choice-image-container"}>
          <img id={`${props.id}-image`} className={"multi-choice-image"} src={props.image}/>
          <div id={`${props.id}-question-container`} className={"multi-choice-question-container"}>{props.question}</div>
          <form id={`${props.id}-answer-form`} className={"multi-choice-answers-form"}>
              <div id={`${props.id}-answer-container`} className={"multi-choice-answers-container"}>
                  {questions}
              </div>
          </form>
      </div>
    );
}
