import React from "react";
import "../css/modal.css";

export default function ModalDialog(props) {
    if (!props.visible) {
        return "";
    }

    return (
        <div
            id={"modal-post-container-" + props.id}
            className={"modal-dialog custom-modal-dialog" + (props.visible ? " modal-visible" : " modal-hidden")}
            onClick={() => props.onBackgroundClicked()}>
            <div className={"modal-dialog-container"}
                onClick={(event) => props.onDialogClicked(event)}>
                {props.body}
            </div>
        </div>
    );
}
