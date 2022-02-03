import React from "react";
import "../css/validation_error_dialog.css";


export default class ValidationErrorDialog extends React.Component {
    render() {
        return <div className={"validation-error-dialog"}>
            <div className={"validation-error-title"}>
                Validation Errors
            </div>
            <hr className={"validation-section-separator"} />
            <div className={"validation-error-body"}>
                You have not interacted with several elements important to the study.
                Elements that require attention have been <span className={"red-highlight"}>highlighted in red for you</span>.
                Completeness is important to the results of the study.
                Please ensure you have interacted with everything and opened all excerpts.
                <p className={"bold"}>To finish interacting with all elements, press the Continue button below.</p>
                Or, if you are ready for the next segment, press the "arrow" button at the bottom of the page again to continue to the next phase of the study.
            </div>
            <hr className={"validation-section-separator"} />
            <button className={"validation-done-button button"} onClick={this.props.onDialogDismissed}>Continue</button>
        </div>
    }
}