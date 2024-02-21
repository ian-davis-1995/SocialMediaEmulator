import React from "react";
import "../css/prior_knowledge_question.css";

export default function PriorKnowledgeQuestion(props) {
    let buttonZeroClass = "prior-knowledge-answer-button";
    let buttonOneClass = "prior-knowledge-answer-button";
    let buttonTwoClass = "prior-knowledge-answer-button";
    let buttonThreeClass = "prior-knowledge-answer-button";
    let buttonFourClass = "prior-knowledge-answer-button";
    let buttonFiveClass = "prior-knowledge-answer-button";
    let disabled = props.currentAnswer === undefined || props.currentAnswer === null;

    if (props.currentAnswer === 0 || props.currentAnswer === undefined || props.currentAnswer === null) {
        buttonZeroClass += " active";
    } else if (props.currentAnswer === 1) {
        buttonOneClass += " active";
    } else if (props.currentAnswer === 2) {
        buttonTwoClass += " active";
    } else if (props.currentAnswer === 3) {
        buttonThreeClass += " active";
    } else if (props.currentAnswer === 4) {
        buttonFourClass += " active";
    } else if (props.currentAnswer === 5) {
        buttonFiveClass += " active";
    }

    return <div className={"prior-knowledge-container"} id={`${props.id}-prior-knowledge-question`}>
        <div className={"prior-knowledge-question-text"} id={`${props.id}-prior-knowledge-question-text`}>
            What is your prior knowledge of the exact content of the passage you just read?
        </div>
        <div className={"prior-knowledge-answers-container"} id={`${props.id}-prior-knowledge-answer-container`}>
            <div className={"prior-knowledge-answer-container"}
                id={`${props.id}-prior-knowledge-answer-1-container`}>
                <div className={buttonOneClass}
                    onClick={() => props.onPriorKnowledgeChanged(props.id, 1)}><span
                        className={"prior-knowledge-button-text"}>1- little to no knowledge</span></div>
            </div>
            <div className={"prior-knowledge-answer-container"}
                id={`${props.id}-prior-knowledge-answer-2-container`}>
                <div className={buttonTwoClass}
                    onClick={() => props.onPriorKnowledgeChanged(props.id, 2)}><span
                        className={"prior-knowledge-button-text"}>2</span></div>
            </div>
            <div className={"prior-knowledge-answer-container"}
                id={`${props.id}-prior-knowledge-answer-3-container`}>
                <div className={buttonThreeClass}
                    onClick={() => props.onPriorKnowledgeChanged(props.id, 3)}><span
                        className={"prior-knowledge-button-text"}>3</span></div>
            </div>
            <div className={"prior-knowledge-answer-container"}
                id={`${props.id}-prior-knowledge-answer-4-container`}>
                <div className={buttonFourClass}
                    onClick={() => props.onPriorKnowledgeChanged(props.id, 4)}><span
                        className={"prior-knowledge-button-text"}>4</span></div>
            </div>
            <div className={"prior-knowledge-answer-container"}
                id={`${props.id}-prior-knowledge-answer-5-container`}>
                <div className={buttonFiveClass}
                    onClick={() => props.onPriorKnowledgeChanged(props.id, 5)}><span
                        className={"prior-knowledge-button-text"}>5- extremely knowledgeable</span></div>
            </div>
        </div>
        <div className={"prior-knowledge-submit-container"} id={`${props.id}-prior-knowledge-submit-container`}>
            <button className={"prior-knowledge-no-answer-button button"}
                id={`${props.id}-prior-knowledge-no-answer-button`}
                onClick={function () {
                    props.onPriorKnowledgeChanged(props.id, 0);
                    props.onSubmitClicked();
                }}>
                <span className={"prior-knowledge-no-answer-text"}>Decline to answer</span>
            </button>
            <button className={"prior-knowledge-submit-button button"}
                id={`${props.id}-prior-knowledge-submit-button`}
                onClick={props.onSubmitClicked} disabled={disabled}>
                <span className={"prior-knowledge-button-text"}>Submit</span>
            </button>
        </div>
    </div>;
}