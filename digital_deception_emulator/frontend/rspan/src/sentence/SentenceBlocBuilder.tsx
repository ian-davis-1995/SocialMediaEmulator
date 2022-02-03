import React from "react";
import {BlocBuilder} from "@felangel/react-bloc";
import {
    ShowingSensePromptState,
    ShowingSentenceFeedbackState,
    ShowingSentenceState
} from "../states/SentenceStates";
import SentenceInstructions1 from "./SentenceInstructions1";
import SentenceInstructions2 from "./SentenceInstructions2";
import SentenceInstructions3 from "./SentenceInstructions3";
import SentenceView from "./SentenceView";
import SentenceMakesSensePrompt from "./SentenceMakesSensePrompt";

import "../css/sentence-task.css";
import {ExperimentState, ExperimentStateType} from "../states/ExperimentState";

export default function SentenceBlocBuilder(props: Record<string, any>) {
    return <BlocBuilder
        bloc={props.bloc}
        builder={(state: ExperimentState) => {
            console.debug("Practice Sentence bloc builder got new state: " + ExperimentStateType[state.stateType]);
            switch (state.stateType) {
                case ExperimentStateType.SENTENCE_INSTRUCTIONS1:
                    return <SentenceInstructions1 bloc={props.bloc}/>
                case ExperimentStateType.SENTENCE_INSTRUCTIONS2:
                    return <SentenceInstructions2 bloc={props.bloc}/>
                case ExperimentStateType.SENTENCE_INSTRUCTIONS3:
                    return <SentenceInstructions3 bloc={props.bloc}/>
                case ExperimentStateType.SHOWING_SENTENCE:
                    return <SentenceView
                        sentence={(state as ShowingSentenceState).sentence}
                        expectedResponse={(state as ShowingSentenceState).expectedResponse}
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
                default:
                    return <p>Unkown practice sentence state {state.stateType}</p>;
            }}}/>
}
