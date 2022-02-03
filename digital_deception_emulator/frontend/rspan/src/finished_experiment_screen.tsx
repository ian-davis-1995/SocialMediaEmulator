import React from "react";

export default class FinishedExperimentScreen extends React.Component {
  render() {
    return (
      <div id="finished-experiment-container">
        <h1 className="finished-experiment-title">Phase Completed</h1>
        <h2 className="finished-experiment-section">
          This concludes the demographic phase of the study.
        </h2>
        <h2 className="finished-experiment-section">
          Please continue to the next phase by using the "arrow" button at the
          bottom of your browser.
        </h2>
      </div>
    );
  }
}
