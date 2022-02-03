import React from "react";
import { QuizBody } from "../quiz";
import { NewsPostBody } from "./news_story";
import BrickWallCigar from "../distractions/brick-wall-cigar";
import TwoSimilarPictures from "../distractions/two-similar-pictures";
import ImageChooser from "../distractions/image-chooser";
import SingleImageView from "../distractions/single-image-view";
import { MultiChoiceImage } from "../distractions/multi_choice_image";
import SeparatedStory from "./separated_story";
import VerticalSeparatedStory from "./vertical_separated_story";


export function BasicPostBody(props) {
    return (
        <div className="post-body-container" id={props.id + "-body"}>
            {props.post.body}
        </div>
    );
}

export function FillerPostBody(props) {
    let image;
    let text;

    if (props.post.image !== undefined && props.post.image !== null) {
        image = <div className={"post-image-container"} id={props.id + "-image-container"}>
            <img src={props.post.image}
                alt={props.post.imageAlt} className={"post-image"}
                id={props.id + "-image"}
                width={props.post.imageWidth}
                height={props.post.imageHeight} />
        </div>;
    }

    if (props.post.text !== undefined && props.post.text !== null) {
        text = <p>{props.post.text}</p>;
    }

    return (
        <div className="post-body-container" id={props.id + "-body"}>
            {image}
            {text}
        </div>
    )
}

function RepliesSection(props) {
    let repliesMessage;

    if (props.post.replies.length === 1) {
        repliesMessage = "View 1 comment";
    } else {
        repliesMessage = "View " + props.post.replies.length + " comments";
    }

    return (
        <div className={"post-replies-container"}>
            <hr className={"post-section-separator"} />
            <button type={"button"} className={"button post-replies-button"}
                onClick={() => {
                    props.onRepliesClicked()
                }}
                id={props.id + "-view-replies-button"}>{repliesMessage}</button>
        </div>
    )
}

function ButtonRow(props) {
    return (<div className={"post-button-container"}>
        <button type="button" className={"button button-bar-button" + (props.seenChosen ? " chosen" : "")}
            onClick={() => props.onSeenClicked()} disabled={props.seenChosen}
            id={props.id + "-seen-button"}>
            <i className="material-icons button-icon">check</i>
            <div className={"post-button-text"}>Seen Before</div>
        </button>
        <button type="button" className={"button button-bar-button" + (props.uniqueChosen ? " chosen" : "")}
            onClick={() => props.onUniqueClicked()} disabled={props.uniqueChosen}
            id={props.id + "-unique-button"}>
            <i className="material-icons button-icon">cancel</i>
            <div className={"post-button-text"}>Unique</div>
        </button>
    </div>
    );
}

export function PostBody(props) {
    if (props.post.type === "basic") {
        return BasicPostBody(props);
    } else if (props.post.type === "quiz") {
        return QuizBody(props);
    } else if (props.post.type === "news_story") {
        return <NewsPostBody post={props.post}
            id={props.id}
            modal={props.modal}
            onNewsPostClicked={() => { props.onNewsPostClicked() }} />;
    } else if (props.post.type === "filler") {
        return FillerPostBody(props);
    } else if (props.post.type === "distraction-brick-wall-cigar") {
        return <BrickWallCigar />;
    } else if (props.post.type === "two-similar-pictures") {
        return <TwoSimilarPictures imageOne={props.post.imageOne}
            imageTwo={props.post.imageTwo}
            id={props.post.id}
            imageOneWidth={props.post.imageOneWidth}
            imageOneHeight={props.post.imageOneHeight}
            imageTwoWidth={props.post.imageTwoWidth}
            imageTwoHeight={props.post.imageTwoHeight}
            description={props.post.description} />;
    } else if (props.post.type === "image-chooser") {
        return <ImageChooser images={props.post.images}
            imagesPerRow={props.post.imagesPerRow}
            prompt={props.post.prompt}
            id={props.post.id} />;
    } else if (props.post.type === "single-image-view") {
        return <SingleImageView image={props.post.image}
            prompt={props.post.prompt}
            id={props.post.id}
            imageWidth={props.post.imageWidth}
            imageHeight={props.post.imageHeight} />
    } else if (props.post.type === "multiple-choice-image") {
        return <MultiChoiceImage image={props.post.image}
            question={props.post.question}
            id={props.post.id}
            answers={props.post.answers}
            currentAnswer={props.post.answer}
            onAnswerChanged={props.onMultiChoiceAnswerChanged} />;
    } else if (props.post.type === "separated_story") {
        return <SeparatedStory storySegments={props.post.storySegments}
            id={props.post.id}
            comments={props.post.comments}
            currentAnswer={props.post.answer}
            onPriorKnowledgeChanged={props.onPriorKnowledgeChanged} />;
    } else if (props.post.type === "vertical_separated_story") {
        return <VerticalSeparatedStory
            modal={props.modal}
            title={props.post.title}
            storySegments={props.post.storySegments}
            currentAnswer={props.post["answer"]}
            id={props.post.id}
            comments={props.post.comments}
            currentAnswer={props.post.answer}
            showHelpInstructions={props.showHelpInstructions}
            onStoryClicked={props.onVerticalSeparatedStoryClicked}
            onStoryCompleted={props.onStoryCompleted}
            onStorySegmentRead={props.onStorySegmentRead}
            hasErrors={props.hasErrors}
            showValidationErrors={props.showValidationErrors}
            onPriorKnowledgeChanged={props.onPriorKnowledgeChanged} />;
    } else {
        return <div />;
    }
}

export function SocialMediaPost(props) {
    let repliesSection;

    if (props.post["replies"] !== undefined) {
        repliesSection = RepliesSection(props);
    }

    let buttonRow;
    let profilePicture;

    if (props.post.profilePicture !== undefined && props.post.profilePicture !== null) {
        profilePicture = <div className={"profile-picture-container"}>
            <img src={props.post.profilePicture}
                className={"profile-picture"} alt={"User Profile"} id={props.id + "-profile-picture"} />
        </div>;
    }

    let topBar;

    if (!props.post.advertisementStyle) {
        topBar = (
            <div id={`${props.id}-title-container`}>
                <div className={"post-title-container"} id={props.id + "-title"}>
                    {profilePicture}
                    <div className={"post-author-container"} id={props.id + "-author"}>
                        {props.post.author}
                    </div>
                    <div className={"post-date-container"} id={props.id + "-post-date"}>
                        {props.post.postDate}
                    </div>
                </div>
                <hr className={"post-section-separator"} />
            </div>
        );
    } else {
        // In advertisement mode we don't show the top bar, button bar or replies section. Just content.
        topBar = (
            <div className={"advertisement-title-container"} id={`${props.id}-advertisement-title`}>
                Sponsored
                <hr className={"post-section-separator"} />
            </div>
        );
        repliesSection = "";
    }

    let postContainerClassName = "post-container";

    if (props.showValidationErrors && props.hasErrors) {
        postContainerClassName += " has-errors";
    }

    return (
        <div id={props.id} className={postContainerClassName}>
            {topBar}
            <PostBody
                post={props.post}
                onNewsPostClicked={props.onNewsPostClicked}
                hasErrors={props.hasErrors}
                showValidationErrors={props.showValidationErrors}
                onVerticalSeparatedStoryClicked={props.onVerticalSeparatedStoryClicked}
                onMultiChoiceAnswerChanged={props.onMultiChoiceAnswerChanged}
                showHelpInstructions={props.showHelpInstructions}
                onStorySegmentRead={props.onStorySegmentRead}
                onStoryCompleted={props.onStoryCompleted}
                modal={props.modal} />
            {repliesSection}
        </div>
    );
}