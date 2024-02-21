import React from "react";
import $ from "jquery";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../css/modal.css";
import "../css/vertical_separated_story.css";


const autoBind = require("auto-bind");

console.debug("Setting window.minScrollDelay");
window.minScrollDelay = 1250;
console.debug(window.minScrollDelay);

export default class VerticalSeparatedStory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentChunkShown: 0,
            showComments: false,
        };

        this.lastScrollEventTime = Date.now();
        this.segmentReadStartTime = Date.now();
        this.mouseInsideComments = false;

        autoBind(this);
    }

    onShowCommentsClicked() {
        this.setState({
            showComments: !this.state.showComments,
        });
    }

    getCommentPage() {
        if (this.props.comments === undefined || this.props.comments === null || this.props.comments.length === 0) {
            return <div />;
        } else if (!this.state.showComments) {
            return <div className={"vertical-comment-button-container"} id={`${this.props.id}-comments-container`}>
                <button className={"button vertical-comment-button"}
                    id={`${this.props.id}-comment-button`}
                    onClick={this.onShowCommentsClicked}>View Comments</button>
            </div>;
        } else {
            let comments = [];

            for (let i = 0; i < this.props.comments.length; i++) {
                let comment = this.props.comments[i];
                comments.push(
                    <div className={"vertical-comment-container"} id={`${this.props.id}-comment-${i}-container`} key={i}>
                        <div className={"vertical-comment-top-bar"} id={`${this.props.id}-comment-${i}-top-bar`}>
                            <div className={"vertical-comment-author-container"} id={`${this.props.id}-comment-${i}-author-container`}>
                                {comment.author}
                            </div>
                            <div className={"vertical-comment-date-container"} id={`${this.props.id}-comment-${i}-date-container`}>
                                {comment.postDate}
                            </div>
                        </div>
                        <div className={"vertical-comment-body"} id={`${this.props.id}-comment-${i}-body`}>
                            <div dangerouslySetInnerHTML={{ __html: comment.body }}></div>
                        </div>
                    </div>);
            }

            return <div className={"vertical-comments-container"} id={`${this.props.id}-comments-container`}>
                {comments}
                <button className={"button vertical-comment-collapse-button"}
                    id={`${this.props.id}-comments-collapse-button`}
                    onClick={this.onShowCommentsClicked}>
                    Hide comments
                </button>
            </div>;
        }
    }

    getStoryText() {
        return this.props.storySegments[this.state.currentChunkShown];
    }

    getHelpInstructions() {
        if (this.state.currentChunkShown < this.props.storySegments.length - 1) {
            return <div className={"vertical-story-help-instructions"}>
                To navigate through segments, click the segment indicators on the right.
            </div>
        }
    }

    hasMoreChunks() {
        return this.state.currentChunkShown < this.props.storySegments.length - 1;
    }

    componentDidMount() {
        if (!this.props.modal) {
            return;
        }

        let id = `#${this.props.id}-chunk-container`;
        console.debug("binding scroll event for " + id);
        // $(document).on("wheel", this.onMouseWheelScrolled);
        // $(`#${this.props.id}-comments-container`).on("mouseenter", this.onCommentsEntered);
        // $(`#${this.props.id}-comments-container`).on("mouseleave", this.onCommentsLeft);
        this.segmentReadStartTime = Date.now();
    }

    onCommentsEntered(event) {
        console.debug("mouse entered comments");
        this.mouseInsideComments = true;
    }

    onCommentsLeft(event) {
        console.debug("mouse left comments");
        this.mouseInsideComments = false;
    }

    onMouseWheelScrolled(event) {
        if (this.mouseInsideComments) {
            // console.debug("ignoring wheel event because mouse inside comments");
            return;
        }
        let wheelDelta = event.originalEvent.wheelDelta;
        // console.debug("On mouse wheel scrolled, window.minScrollDelay = " + window.minScrollDelay);

        // console.debug("[VERTICAL_SEPARATED_STORY][SCROLL] - User scrolled on vertical separated story");
        // console.debug("wheel delta = " + wheelDelta);

        if (wheelDelta > 0) {
            // console.debug("[VERTICAL_SEPARATED_STORY][SCROLL] - User scrolled vertically -- ignoring");
            return;
        } else if (wheelDelta > -120) {
            // console.debug("[VERTICAL_SEPARATED_STORY][SCROLL] - User did pass scroll vertical threshold -- ignoring");
            return;
        }

        let date = Date.now();
        let msElapsed = Math.abs(date - this.lastScrollEventTime);
        let readTime = Math.abs(date - this.segmentReadStartTime);

        if (msElapsed < 50) {
            // console.debug("Ignoring trackpad related scroll event");
            this.lastScrollEventTime = date;
            return;
        }

        if (msElapsed < window.minScrollDelay) {
            // console.debug("Ignoring flooded scroll event");
            return;
        }

        this.lastScrollEventTime = date;

        if (this.hasMoreChunks()) {
            // console.debug("moving to next segment");
            this.props.onStorySegmentRead(date, this.props.id, this.state.currentChunkShown, readTime);
            this.segmentReadStartTime = Date.now();
            this.setState({
                currentChunkShown: this.state.currentChunkShown + 1,
            });
        }
    }

    feedView() {
        let containerClassName = "vertical-post-body-container vertical-separated-story-container vertical-separated-story-feed-view";

        if (this.props.hasErrors && this.props.showValidationErrors) {
            containerClassName += " has-errors";
        }

        let enabled = this.props.currentAnswer === undefined || this.props.currentAnswer === null;
        let onClick = null;

        if (enabled) {
            onClick = this.props.onStoryClicked;
        }

        return (
            <button id={`${this.props.id}-body`} className={containerClassName} disabled={!enabled}>
                <div className={"vertical-separated-story-title-container"}
                    onClick={onClick}
                    id={`${this.props.id}-title-container`}>
                    <p className={"vertical-separated-story-title"}>
                        {this.props.title}
                    </p>
                    <p id={`${this.props.id}-separated-story-click-indicator`} className={"vertical-separated-story-click-indicator"}>
                        Click to read the excerpt
                    </p>
                </div>
            </button>
        );
    }

    scrollIndicators() {
        let indicators = [];

        let containerHeight = 300;
        let paddingHeight = 5 * this.props.storySegments.length;
        let remainingHeight = containerHeight - paddingHeight;

        for (let i = 0; i < this.props.storySegments.length; i++) {
            let active = this.state.currentChunkShown === i;
            let className = "vertical-story-scroll-indicator";

            if (active) {
                className += " active";
            }

            let size = Math.min(remainingHeight / this.props.storySegments.length, 40);

            indicators.push(<span className={className} key={i} style={{
                "height": `${size}px`,
                "width": `${size}px`
            }} onClick={() => this.onScrollIndicatorClicked(i)} />);
        }

        return indicators;
    }

    onScrollIndicatorClicked(index) {
        if (index <= this.state.currentChunkShown) {
            // We don't allow the user to go back to old chunks.
            return;
        }

        let date = Date.now();
        let readTime = Math.abs(date - this.segmentReadStartTime);

        console.debug("mouse clicked indicator -- read time = " + readTime);

        if (readTime < window.minScrollDelay) {
            console.debug("Ignoring flooded navigate click event");
            return;
        }

        this.props.onStorySegmentRead(date, this.props.id, this.state.currentChunkShown, readTime);
        this.segmentReadStartTime = Date.now();

        this.setState({
            currentChunkShown: this.state.currentChunkShown + 1,
        });
    }

    verticalStoryScroll() {
        return (
            <div className={"vertical-story-chunk-container"} id={`${this.props.id}-chunk-container`}>
                <SwitchTransition>
                    <CSSTransition key={this.state.currentChunkShown}
                        timeout={250}
                        classNames="vertical-story-chunk-text-animated">
                        <div className={"vertical-story-chunk-text"} id={`${this.props.id}-chunk-text`}>
                            <span>
                                {this.getStoryText()}
                            </span>
                        </div>
                    </CSSTransition>
                </SwitchTransition>
                <div className={"vertical-story-scroll-indicators"}>
                    {this.scrollIndicators()}
                </div>
            </div>
        );
    }

    modalView() {
        let endStoryContainer = "";

        if (this.state.currentChunkShown >= this.props.storySegments.length - 1) {
            endStoryContainer = <div className={"end-story-container"}>
                <button className={"story-continue-button button"} onClick={this.onContinueClicked}>Continue</button>
            </div>;
        }

        return (
            <div id={`${this.props.id}-modal-body`}
                className={"vertical-post-body-container vertical-separated-story-container vertical-separated-story-modal-view"}>
                {this.verticalStoryScroll()}
                {this.getHelpInstructions()}
                {this.getCommentPage()}
                {endStoryContainer}
            </div>
        );
    }

    render() {
        if (this.props.modal) {
            return this.modalView();
        } else {
            return this.feedView();
        }
    }

    onArrowClicked() {
        this.setState({
            currentChunkShown: this.state.currentChunkShown + 1,
        });
    }

    onContinueClicked() {
        console.debug("Continue clicked -- calling onStoryCompleted event " + this.props.onStoryCompleted);
        this.props.onStoryCompleted();
    }
}
