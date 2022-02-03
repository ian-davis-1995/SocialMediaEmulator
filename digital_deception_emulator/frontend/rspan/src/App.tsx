import React from "react";

import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/css/bootstrap.css";
import "./css/App.css";

import { AppBloc } from "./AppBloc";
import { BlocBuilder } from "@felangel/react-bloc";
import { PracticeLetterBloc } from "./letters/PracticeLetterBloc";
import { PracticeSentenceBloc } from "./sentence/PracticeSentenceBloc";

import {
  AppState,
  AppStateType,
  PracticeBothState,
  PracticeLettersState,
  RunningExperimentState,
  UploadingExperimentState,
} from "./states/AppState";
import { ExperimentState } from "./states/ExperimentState";

import { version } from "../package.json";

import LetterBlocBuilder from "./letters/LetterBlocBuilder";
import SentenceBlocBuilder from "./sentence/SentenceBlocBuilder";
import ExperimentBlocBuilder from "./experiment/ExperimentBlocBuilder";
import { ExperimentBloc } from "./experiment/ExperimentBloc";

import UploadingResultsScreen from "./network/screens/UploadingResults";
import FinishedExperimentScreen from "./finished_experiment_screen";

import ServerDriver from "./network/server_driver";

interface AppConfig {
  initialAppState?: AppState;
  initialPracticeLetterState?: ExperimentState;
  initialPracticeSentenceState?: ExperimentState;
  subjectId?: string;
  onExperimentFinished?: Function;
}

function App(props: AppConfig) {
  console.debug(`subjectId=${props.subjectId}`);

  const serverDriver = new ServerDriver();
  const timestamp = new Date();

  const appBloc = new AppBloc(
    props.initialAppState ? props.initialAppState : new PracticeLettersState(),
    version,
    props.subjectId ? props.subjectId : "missing-subject-id",
    timestamp,
    serverDriver,
    props.onExperimentFinished ? props.onExperimentFinished : () => {}
  );

  const practiceLetterBloc = new PracticeLetterBloc(
    appBloc,
    props.initialPracticeLetterState
  );

  const practiceSentenceBloc = new PracticeSentenceBloc(
    appBloc,
    props.initialPracticeSentenceState
  );

  const experimentBloc = new ExperimentBloc(appBloc);

  return (
    <div className={"App"}>
      <BlocBuilder
        bloc={appBloc}
        builder={(state: AppState) => {
          console.debug(
            "App Bloc Builder got new state: " + AppStateType[state.stateType]
          );

          switch (state.stateType) {
            case AppStateType.PRACTICE_LETTERS:
              return <LetterBlocBuilder bloc={practiceLetterBloc} />;

            case AppStateType.PRACTICE_SENTENCE:
              return <SentenceBlocBuilder bloc={practiceSentenceBloc} />;

            case AppStateType.PRACTICE_BOTH:
              experimentBloc.reset(
                true,
                (state as PracticeBothState).maxReadingTime
              );
              return <ExperimentBlocBuilder bloc={experimentBloc} />;

            case AppStateType.RUNNING_EXPERIMENT:
              experimentBloc.reset(
                false,
                (state as RunningExperimentState).maxReadingTime
              );
              return <ExperimentBlocBuilder bloc={experimentBloc} />;

            case AppStateType.UPLOADING_EXPERIMENT:
              return <UploadingResultsScreen />;

            case AppStateType.FINISHED_EXPERIMENT:
              return <FinishedExperimentScreen />;

            default:
              return (
                <div className="App">
                  <header className="App-header">
                    <p>
                      TODO: Implement App State {AppStateType[state.stateType]}
                    </p>
                  </header>
                </div>
              );
          }
        }}
      />
    </div>
  );
}

export default App;
