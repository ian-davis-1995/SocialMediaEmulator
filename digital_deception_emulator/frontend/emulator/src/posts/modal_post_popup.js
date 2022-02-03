import React from "react";

import "../css/modal.css";
import { PostBody } from "./post_layouts";

function ModalPostLayout(props) {
    let repliesSection = "";
    if (props.post.replies !== undefined && props.post.replies !== null) {
        repliesSection = RepliesSection(props);
    }

    let profilePicture = "";

    if (props.post.profilePicture !== undefined) {
        profilePicture = <div className={"profile-picture-container"} id={props.id + "-modal-profile-picture-container"}>
            <img src={props.post.profilePicture}
                className={"profile-picture"}
                alt={"User Profile"}
                id={props.id + "-modal-profile-picture"} />
        </div>
    }

    return (
        <div id={props.id}>
            <div className={"post-title-container modal-post-title"} id={props.id + "-modal-post-title"}>
                {profilePicture}
                <div className={"post-author-container"} id={props.id + "-modal-post-author-container"}>
                    {props.post.author}
                </div>
                <div className={"post-date-container"} id={props.id + "-modal-post-date-container"}>
                    {props.post.postDate}
                </div>
                {/* <button className={"button close-dialog-button"}>
                    <span className="material-icons" onClick={() => props.onCloseClicked()}>
                        close
                    </span>
                </button> */}
            </div>
            <hr className={"post-section-separator"} id={props.id + "-modal-post-section-separator"} />
            <div id={props.id + "-modal-post-body"} className={"modal-post-body"}>
                <PostBody post={props.post}
                    onStorySegmentRead={props.onStorySegmentRead}
                    onStoryCompleted={props.onStoryCompleted}
                    showHelpInstructions={props.showHelpInstructions}
                    onNewsPostClicked={props.onNewsPostClicked}
                    modal={true}
                    id={props.post.id} />
            </div>
            <div id={props.id + "-modal-replies-body"} className={"modal-replies-body"}>
                {repliesSection}
            </div>
        </div>
    );
}

function RepliesSection(props) {
    let items = [];

    for (let i = 0; i < props.post.replies.length; i++) {
        let reply = props.post.replies[i];
        items.push(<ReplyLayout reply={reply} index={i} />);
    }

    return (
        <div className={"modal-replies-container"} id={props.id + "-replies-container"}>
            <hr className={"post-section-separator"} id={props.id + "-section-separator"} />
            <div className={"modal-replies-height-container"} id={props.id + "-replies-height-container"}>
                {items}
            </div>

        </div>
    );
}

export function ReplyLayout(props) {
    let profilePictureContainer = "";

    if (props.reply.profilePicture !== undefined) {
        profilePictureContainer = <div className={"modal-profile-picture-container"} id={props.reply.id + "-profile-picture-container"}>
            <img src={props.reply.profilePicture} className={"modal-profile-picture"} alt={"User Profile"}
                id={props.reply.id + "-profile-picture"} />
        </div>;
    }

    return (
        <div className={"modal-reply-container"} id={props.reply.id}>
            <div className={"modal-reply-flex-wrapper"} id={props.reply.id + "-flex-wrapper"}>
                {profilePictureContainer}
                <div className={"modal-reply-body"} id={props.reply.id + "-body"}>
                    <h5 className={"modal-reply-author"} id={props.reply.id + "-author"}>{props.reply.author}</h5>
                    {props.reply.body}
                </div>
            </div>

            <div className={"modal-reply-bar"} id={props.reply.id + "-button-bar"}>
                <button type="button"
                    className={"button modal-reply-button" + (props.seenChosen ? " chosen" : "")}
                    onClick={() => props.onSeenClicked()}
                    disabled={props.seenChosen}
                    id={props.reply.id + "-seen-button"}>
                    <i className="material-icons button-icon" id={props.reply.id + "-seen-before-icon"}>check</i>
                    <div className={"post-button-text"} id={props.reply.id + "-seen-before-text"}>Seen Before</div>
                </button>
                <button type="button"
                    className={"button modal-reply-button" + (props.uniqueChosen ? " chosen" : "")}
                    onClick={() => props.onUniqueClicked()}
                    disabled={props.uniqueChosen}
                    id={props.reply.id + "-unique-button"}>
                    <i className="material-icons button-icon"
                        id={props.reply.id + "-unique-icon"}>cancel</i>
                    <div className={"post-button-text"}
                        id={props.reply.id + "-unique-text"}>Unique
                    </div>
                </button>
            </div>
        </div>
    );
}

export default function ModalPostPopup(props) {
    return (
        <div
            id={"modal-post-container-" + props.id}
            className={"modal-dialog" + (props.visible ? " modal-visible" : " modal-hidden")}
            onClick={() => props.onBackgroundClicked()}>
            <div className={"modal-post-container"}
                onClick={(event) => props.onDialogClicked(event)}>
                {props.post !== null ?
                    <ModalPostLayout post={props.post}
                        id={props.id}
                        onCloseClicked={props.onCloseClicked}
                        onStorySegmentRead={props.onStorySegmentRead}
                        onStoryCompleted={props.onStoryCompleted} /> : ""}
            </div>
        </div>
    );
}
