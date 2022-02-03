import "regenerator-runtime/runtime.js";
import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import {
  PracticeBothState,
  PracticeSentenceState,
  RunningExperimentState,
} from "./states/AppState";

const subjectId = window.subjectId ? window.subjectId : "missing-subject-id";
const qualtricsEmbedded = window.qualtricsEmbedded
  ? window.qualtricsEmbedded
  : false;

function onExperimentFinished() {
  if (
    window.parent.window === undefined ||
    window.parent.window === null ||
    !qualtricsEmbedded
  )
    return;

  window.parent.window.postMessage(
    {
      event_type: "experiment_finished",
    },
    "*"
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App
      subjectId={subjectId}
      onExperimentFinished={onExperimentFinished}
      //   initialAppState={new RunningExperimentState()}
    />
  </React.StrictMode>,
  document.getElementById("root")
);
