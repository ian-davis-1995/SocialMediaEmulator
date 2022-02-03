import React from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import "../css/separated_story.css";
import PriorKnowledgeQuestion from "../components/prior_knowledge_question";

export default class SeparatedStory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentChunkShown: 0,
        };

        this.onArrowClicked = this.onArrowClicked.bind(this);
        this.getPriorKnowledgeQuestion = this.getPriorKnowledgeQuestion.bind(this);
        this.getCommentPage = this.getCommentPage.bind(this);
        this.getStoryTexts = this.getStoryTexts.bind(this);
    }

    getPriorKnowledgeQuestion() {
        return <PriorKnowledgeQuestion
            currentAnswer={this.props.currentAnswer}
            id={this.props.id}
            onPriorKnowledgeChanged={this.props.onPriorKnowledgeChanged}/>;
    }

    getCommentPage() {
        if (this.props.comments === undefined || this.props.comments === null || this.props.comments.length === 0) {
            return <div/>;
        } else {
            let comments = [];

            for (let i = 0; i < this.props.comments.length; i++) {
                let comment = this.props.comments[i];
                comments.push(
                    <div className={"comment-container"} id={`${this.props.id}-comment-${comment.id}-container`} key={i}>
                        <div className={"comment-top-bar"} id={`${this.props.id}-comment-${comment.id}-top-bar`}>
                            <div className={"comment-author-container"} id={`${this.props.id}-comment-${comment.id}-author-container`}>
                                {comment.author}
                            </div>
                            <div className={"comment-date-container"} id={`${this.props.id}-comment-${comment.id}-date-container`}>
                                {comment.postDate}
                            </div>
                        </div>
                        <div className={"comment-body"} id={`${this.props.id}-comment-${comment.id}-body`}>
                            {comment.body}
                        </div>
                    </div>);
            }

            return <div className={"comments-container"} id={`${this.props.id}-comments-container`}>
                {comments}
            </div>;
        }
    }

    getStoryTexts() {
        if (this.state.currentChunkShown === this.props.storySegments.length) {
            return this.getPriorKnowledgeQuestion();
        } else if (this.state.currentChunkShown === this.props.storySegments.length + 1) {
            return this.getCommentPage();
        } else {
            return this.props.storySegments[this.state.currentChunkShown];
        }
    }

    render() {
        return (
            <div id={`${this.props.id}-body`} className={"post-body-container separated-story-container"}>
                <div className={"story-chunk-container"} id={`${this.props.id}-chunk-container`}>
                    <SwitchTransition>
                        <CSSTransition key={this.state.currentChunkShown}
                                       timeout={250}
                                       classNames="story-chunk-text-animated">
                            <div className={"story-chunk-text"} id={`${this.props.id}-chunk-text`}>
                                <span>
                                    {this.getStoryTexts()}
                                </span>
                            </div>
                        </CSSTransition>
                    </SwitchTransition>
                </div>
                <button id={`${this.props.id}-story-arrow`}
                        className={"story-arrow"}
                        onClick={this.onArrowClicked}
                        disabled={this.state.currentChunkShown >= this.props.storySegments.length + 1}>
                    Next
                </button>
            </div>
        )
    }

    onArrowClicked() {
        this.setState({
            currentChunkShown: this.state.currentChunkShown + 1,
        });
    }
}
