import React from "react";
import $ from 'jquery';

import QuizResults from "./quiz_results";
// import {DUMMY_QUIZ_QUESTIONS} from "./stimuli/post_data";

import "./css/quiz.css";

export class Quiz extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentQuestion: 1,
            chosenAnswers: {},
            questions: [],
        };
    }

    onAnswerClicked(question, answer) {
        console.groupCollapsed("quiz");
        console.debug("[QUIZ][EVENT][ANSWER_CLICKED] Question: " + question.id + " answer: " + answer);

        if (question.id >= this.state.questions.length) {
            let answerValue = 1;

            if (answer === "Disagree strongly") {
                answerValue = 1;
            } else if (answer === "Disagree a little") {
                answerValue = 2;
            } else if (answer === "Neutral") {
                answerValue = 3;
            } else if (answer === "Agree a little") {
                answerValue = 4;
            } else if (answer === "Agree strongly") {
                answerValue = 5;
            }

            console.debug("[QUIZ][EVENT][FINISHED]");
            this.setState((prevState, props) => {
                let newChosenAnswers = prevState.chosenAnswers;
                newChosenAnswers[question.id] = answerValue;

                return {
                    currentQuestion: question.id + 1,
                    chosenAnswers: newChosenAnswers,
                };
            });
            return;
        }

        console.debug("[QUIZ][EVENT][ANSWER_CLICKED] scrolling to next question id: " + question.id + 1);
        let target = $("#quiz-question-" + (question.id + 1));
        $("html, body").animate(
            {
                scrollTop: target.offset().top
            },
            500
        );

        this.setState((prevState, props) => {
            let newChosenAnswers = prevState.chosenAnswers;
            newChosenAnswers[question.id] = answer;

            return {
                currentQuestion: question.id + 1,
                chosenAnswers: newChosenAnswers,
            };
        });

        console.groupEnd();
    }

    render() {
        if (this.state.currentQuestion > this.state.questions.length) {
            return (
                <QuizResults
                    chosenAnswers={this.state.chosenAnswers}
                />
            );
        }

        const items = [];

        for (const [index, value] of Array.from(this.state.questions.entries())) {
            items.push(
                <QuizQuestion
                    key={index}
                    question={value}
                    currentQuestion={value.id === this.state.currentQuestion}
                    onAnswerClicked={answer => this.onAnswerClicked(value, answer)}
                />
            );
        }

        return (
            <div className="quiz-container">
                {items}
            </div>
        );
    }
}

export function QuizBody(props) {
    return (
        <div className="post-body-container">
            <div className={"quiz-body-container"}>
                <div className={"quiz-post-text quiz-post-title"} id={props.id + "-title"}>
                    Ever wondered what season you are? This quiz will tell you!
                </div>
                <div className={"quiz-post-text"} id={props.id + "-user-result"}>I got Fall!</div>
                <button className="button quiz-button" onClick={() => props.onQuizClicked()}
                    id={props.id + "-take-quiz-button"}>
                    <div className={"quiz-button-text"}>
                        Take The Quiz!
                    </div>
                </button>
            </div>
        </div>
    );
}

function QuizQuestion(props) {
    const items = [];

    for (const [index, value] of Array.from(props.question.answers.entries())) {
        items.push(
            <QuizAnswer
                key={index}
                answer={value}
                question={props.question}
                currentQuestion={props.currentQuestion}
                onAnswerClicked={props.onAnswerClicked}
            />
        );
    }

    return (
        <div className="container mx-auto">
            <div className="question-container mx-auto" id={"quiz-question-" + props.question.id}>
                <div className="question-title" id={"quiz-question-" + props.question.id + "-title"}>
                    <h1>{props.question.title}</h1>
                </div>
                <div className="answers-container" id={"quiz-question-" + props.question.id + "-answers"}>{items}</div>
                <hr className="answer-separator" />
            </div>
        </div>
    );
}

function QuizAnswer(props) {
    if (props.currentQuestion) {
        return (
            <div className="answer-container">
                <div className="answer-text">
                    <button className="link answer-button"
                        onClick={() => props.onAnswerClicked(props.answer)}>{props.answer.text}</button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="answer-container">
                <div className="answer-text">
                    <button className="link answer-button" disabled>
                        {props.answer.text}
                    </button>
                </div>
            </div>
        );
    }
}
