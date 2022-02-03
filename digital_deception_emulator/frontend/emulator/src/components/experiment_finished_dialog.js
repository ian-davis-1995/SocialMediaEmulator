import React from "react";
import "../css/experiment_finished_dialog.css";

export default function ExperimentFinishedDialog(props) {
    let postSocialMediaText = "";

    if (props.practiceMode) {
        postSocialMediaText = "practice reading";
    } else {
        postSocialMediaText = "reading";
    }

    return <div className={"experiment-finished-body"} id={"experiment-finished-body"}>
        <h2>This concludes the {postSocialMediaText} phase of the study.</h2><h2>Please continue to the next phase by using the "arrow" button at the bottom of your browser.</h2>
    </div>
}