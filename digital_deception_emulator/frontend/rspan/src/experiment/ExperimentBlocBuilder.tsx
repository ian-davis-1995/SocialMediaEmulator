import React from "react";
import {BlocBuilder} from "@felangel/react-bloc";
import "../css/letters-task.css";
import {ShowingLetterState} from "../states/LetterStates";
import {ExperimentState, ExperimentStateType, SetFeedbackState} from "../states/ExperimentState";
import LetterGridView from "../letters/LetterGridView";
import LetterView from "../letters/LetterView";
import SentenceView from "../sentence/SentenceView";
import {ShowingSensePromptState, ShowingSentenceFeedbackState, ShowingSentenceState} from "../states/SentenceStates";
import SentenceMakesSensePrompt from "../sentence/SentenceMakesSensePrompt";
import CombinedInstructions1 from "./CombinedInstructions1";
import CombinedInstructions2 from "./CombinedInstructions2";
import CombinedInstructions3 from "./CombinedInstructions3";
import ExperimentStartScreen from "./ExperimentStartScreen";

export default function ExperimentBlocBuilder(props: Record<string, any>) {
    return <BlocBuilder
        bloc={props.bloc}
        builder={
            (state: ExperimentState) => {
                switch (state.stateType) {
                    case ExperimentStateType.EXPERIMENT_START_SCREEN:
                        return <ExperimentStartScreen bloc={props.bloc}/>;
                    case ExperimentStateType.COMBINED_INSTRUCTIONS1:
                        return <CombinedInstructions1 bloc={props.bloc}/>;
                    case ExperimentStateType.COMBINED_INSTRUCTIONS2:
                        return <CombinedInstructions2 bloc={props.bloc}/>;
                    case ExperimentStateType.COMBINED_INSTRUCTIONS3:
                        return <CombinedInstructions3 bloc={props.bloc}/>;
                    case ExperimentStateType.SHOWING_LETTER:
                        return (<LetterView letter={(state as ShowingLetterState).letter}/>);
                    case ExperimentStateType.HIDING_LETTER:
                        return (<div/>);
                    case ExperimentStateType.SHOWING_GRID:
                        return (<LetterGridView bloc={props.bloc}/>);
                    case ExperimentStateType.SET_FEEDBACK:
                        let properState = (state as SetFeedbackState);
                        return (
                            <div id={"experiment-feedback-container"} className={"fullscreen-centered-container"}>
                                <div className={"experiment-feedback-percentage"}>
                                    {Math.floor(properState.percentCorrect)}%
                                </div>
                                <div className={"experiment-feedback-letters"}>
                                    You recalled {properState.lettersCorrect} letters correctly out
                                    of {properState.setSize}
                                </div>
                                <div className={"experiment-feedback-sentences"}>
                                    You made {properState.sentenceErrors} sentence errors.
                                </div>
                            </div>
                        );
                    case ExperimentStateType.SHOWING_SENTENCE:
                        return <SentenceView
                            sentence={(state as ShowingSentenceState).sentence}
                            expectedResponse={(state as ShowingSentenceState).expectedResponse}
                            maxReadingTime={(state as ShowingSentenceState).maxReadingTime}
                            bloc={props.bloc}/>
                    case ExperimentStateType.SHOWING_SENSE_PROMPT:
                        return <SentenceMakesSensePrompt
                            showingFeedback={false}
                            response={false}
                            expectedResponse={(state as ShowingSensePromptState).expectedResponse}
                            readingTimeMillis={(state as ShowingSensePromptState).readingTimeMillis}
                            sentence={(state as ShowingSensePromptState).sentence}
                            bloc={props.bloc}/>
                    case ExperimentStateType.SENTENCE_FEEDBACK:
                        return <SentenceMakesSensePrompt bloc={props.bloc}
                                                         showingFeedback={true}
                                                         sentence={(state as ShowingSentenceFeedbackState).sentence}
                                                         response={(state as ShowingSentenceFeedbackState).response}
                                                         expectedResponse={(state as ShowingSentenceFeedbackState).expectedResponse}
                                                         readingTimeMillis={(state as ShowingSentenceFeedbackState).readingTimeMillis}/>;
                    case ExperimentStateType.ISI_DELAY:
                        return <div id={"isi-delay-container"}/>;
                    default:
                        return <p>Unknown experiment state {state.stateType}</p>;
                }
            }}/>;
}
