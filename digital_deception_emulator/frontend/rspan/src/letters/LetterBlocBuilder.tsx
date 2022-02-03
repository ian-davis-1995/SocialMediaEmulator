import React from "react";
import {BlocBuilder} from "@felangel/react-bloc";
import LetterInstructions1 from "./LetterInstructions1";
import LetterInstructions2 from "./LetterInstructions2";
import LetterInstructions3 from "./LetterInstructions3";
import "../css/letters-task.css";
import {
    ShowingLetterState,
    ShowingPracticeLetterFeedbackState
} from "../states/LetterStates";
import LetterView from "./LetterView";
import LetterGridView from "./LetterGridView";
import {ExperimentState, ExperimentStateType} from "../states/ExperimentState";

export default function LetterBlocBuilder(props: Record<string, any>) {
        return <BlocBuilder
            bloc={props.bloc}
            builder={
                (state: ExperimentState) => {
                    console.debug("Letter bloc builder got new state: " + ExperimentStateType[state.stateType]);
                    switch (state.stateType) {
                        case ExperimentStateType.LETTER_INSTRUCTIONS1:
                            return (<LetterInstructions1 bloc={props.bloc}/>);
                        case ExperimentStateType.LETTER_INSTRUCTIONS2:
                            return (<LetterInstructions2 bloc={props.bloc}/>);
                        case ExperimentStateType.LETTER_INSTRUCTIONS3:
                            return (<LetterInstructions3 bloc={props.bloc}/>);
                        case ExperimentStateType.SHOWING_LETTER:
                            return (<LetterView letter={(state as ShowingLetterState).letter}/>);
                        case ExperimentStateType.HIDING_LETTER:
                            return (<div />);
                        case ExperimentStateType.SHOWING_GRID:
                            return (<LetterGridView bloc={props.bloc}/>);
                        case ExperimentStateType.SHOWING_LETTER_PRACTICE_FEEDBACK:
                            let properState = (state as ShowingPracticeLetterFeedbackState);
                            return (
                                <div id={"practice-letter-feedback-container"} className={"fullscreen-centered-container"}>
                                    You recalled {properState.numberCorrect} letters correctly out of {properState.numberTotal}
                                </div>
                            );
                        default:
                            return <p>Unknown letter state {state.stateType}</p>
                    }}}/>;
}
