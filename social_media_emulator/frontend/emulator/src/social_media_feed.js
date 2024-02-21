import React from "react";

import "./css/theme.css";
import "./css/root.css";
import "./css/post.css";

import $ from "jquery";
import { ExperimentPlayback } from "./experiment_playback";
import { Quiz } from "./quiz";
import { SocialMediaPost } from "./posts/post_layouts";
import ModalPostPopup from "./posts/modal_post_popup";
import { UserInteractionTracker } from "./user_interaction_tracker";
import ModalDialog from "./components/modal_dialog";
import ExperimentFinishedDialog from "./components/experiment_finished_dialog";
import ValidationErrorDialog from "./components/validation_error_dialog";
import FillerQuestion from "./components/filler_question";

const autoBind = require("auto-bind");

export class SocialMediaFeed extends React.Component {
    constructor(props) {
        super(props);

        autoBind(this);

        let posts = {};
        let priorKnowledgeStartTime = Date.now();

        for (let i = 0; i < this.props.posts.length; i++) {
            let currentPost = this.props.posts[i];
            posts[currentPost["id"]] = currentPost;
        }

        this.bottomValidationTimer = null;
        this.idleValidationTimer = null;
        this.validationLimitReached = false;

        this.userInteractionTracker = new UserInteractionTracker(
            this.props.serverDriver,
            this.onTestUploaded,
            this.props.showHeatmap,
            posts,
            this.props.requiredResponsePosts,
            this.onRequiredCriteriaMet,
            this.onAllCriteriaMet,
            this.onUserReachedBottom,
            this.onUserLeftBottom,
            this.onUserScrollIdle
        );

        this.state = {
            viewingVerticalStory: false,
            showingKnowledgeCheck: false,
            modalId: 0,
            showingQuiz: false,
            finishedQuiz: false,
            posts: posts,
            viewingReplies: false,
            postRepliesToView: null,
            experimentFinished: false,
            showingEmulatorValidation: false,
            showingValidationDialog: false,
        };
    }

    quizPage() {
        return (
            <div className="quiz-container container-fluid">
                <div className="row">
                    <div className="col ml-3">
                        <button onClick={() => this.onQuizFinished()}>
                            Back
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col mx-auto">
                        <Quiz />
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        window.addEventListener("message", this.onWindowMessage);

        if (this.props.practiceMode) {
            this.userInteractionTracker.startTracking(
                "practice-" + this.props.testId
            );
        } else {
            this.userInteractionTracker.startTracking(this.props.testId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.viewingReplies && !prevState.viewingReplies) {
            this.userInteractionTracker.onPostRepliesOpened(this.state.modalId);
        } else if (!this.state.viewingReplies && prevState.viewingReplies) {
            this.userInteractionTracker.onPostRepliesClosed(this.state.modalId);
        }

        if (
            this.state.showingKnowledgeCheck ||
            this.state.viewingReplies ||
            this.state.experimentFinished
        ) {
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "scroll";
        }

        if (this.state.showingKnowledgeCheck) {
            this.priorKnowledgeStartTime = Date.now();
        }
    }

    render() {
        if (this.state.showingQuiz) {
            window.scrollTo(0, 0);
            return this.quizPage();
        }

        const items = [];

        for (let id in this.state.posts) {
            if (this.state.posts.hasOwnProperty(id)) {
                let post = this.state.posts[id];
                let hasErrors =
                    post.answer === null || post.answer === undefined;
                console.debug("Post has errors: " + hasErrors);
                console.debug(
                    "Showing validation errors: " +
                        this.state.showingEmulatorValidation
                );

                items.push(
                    <SocialMediaPost
                        seenChosen={post["answer"] === "seen"}
                        uniqueChosen={post["answer"] === "unique"}
                        id={id}
                        post={post}
                        modal={false}
                        hasErrors={hasErrors}
                        showValidationErrors={
                            this.state.showingEmulatorValidation
                        }
                        key={id}
                        onQuizClicked={() =>
                            this.setState({ showingQuiz: true })
                        }
                        onSeenClicked={() => this.onSeenClicked(id)}
                        onUniqueClicked={() => this.onUniqueClicked(id)}
                        onRepliesClicked={() => this.onRepliesClicked(id)}
                        onNewsPostClicked={() => this.onNewsPostClicked(id)}
                        onVerticalSeparatedStoryClicked={() =>
                            this.onVerticalSeparatedStoryClicked(id)
                        }
                        onStorySegmentRead={this.onStorySegmentRead}
                        onMultiChoiceAnswerChanged={(postId, answer) =>
                            this.onMultiChoiceAnswerChanged(postId, answer)
                        }
                        onPriorKnowledgeChanged={(postId, answer) =>
                            this.onPriorKnowledgeChanged(postId, answer)
                        }
                    />
                );
            }
        }

        let currentAnswer = "";

        if (
            this.state.posts !== undefined &&
            this.state.posts !== null &&
            this.state.modalId !== 0
        ) {
            currentAnswer = this.state.posts[this.state.modalId]["answer"];
            console.debug(
                `[SOCIAL_MEDIA_FEED][PRIOR_KNOWLEDGE] - Current Prior Knowledge question answer == ${this.state.modalId}`
            );
        }

        return (
            <div className={"main-container"} id={"mainEmulatorContainer"}>
                <div className={"container-fluid"} id={"feedContainer"}>
                    {items}
                </div>
                <ExperimentPlayback
                    data={this.props.heatmapData}
                    showHeatmap={this.props.showHeatmap}
                    heatmapYOffset={this.props.heatmapYOffset}
                />
                <ModalDialog
                    id={`${this.state.modalId}-prior-knowledge`}
                    visible={this.state.showingKnowledgeCheck}
                    onBackgroundClicked={() => {}}
                    onDialogClicked={(event) =>
                        this.onDialogClicked(
                            this.state.postRepliesToView,
                            event
                        )
                    }
                    body={
                        <FillerQuestion
                            id={this.state.modalId}
                            onContinueClicked={() =>
                                this.onFillerQuestionClicked(this.state.modalId)
                            }
                            currentAnswer={currentAnswer}
                        />
                    }
                />
                <ModalDialog
                    id={`${this.state.modalId}-filler-question`}
                    visible={this.state.showingKnowledgeCheck}
                    onBackgroundClicked={() => {}}
                    onDialogClicked={(event) =>
                        this.onDialogClicked(
                            this.state.postRelpiesToView,
                            event
                        )
                    }
                    body={
                        <FillerQuestion
                            id={this.state.modalId}
                            onContinueClicked={() =>
                                this.onFillerQuestionClicked(this.state.modalId)
                            }
                            currentAnswer={currentAnswer}
                        />
                    }
                />
                <ModalPostPopup
                    id={this.state.modalId}
                    visible={this.state.viewingReplies}
                    post={this.state.postRepliesToView}
                    onStorySegmentRead={this.onStorySegmentRead}
                    onStoryCompleted={this.onStoryCompleted}
                    onCloseClicked={this.onPostRepliesDismissed}
                    onBackgroundClicked={this.onPostRepliesDismissed}
                    onDialogClicked={(event) =>
                        this.onDialogClicked(
                            this.state.postRepliesToView,
                            event
                        )
                    }
                />
                <ModalDialog
                    id={`experiment-finished`}
                    visible={this.state.experimentFinished}
                    onBackgroundClicked={() => {}}
                    onDialogClicked={(event) =>
                        this.onDialogClicked(
                            this.state.postRepliesToView,
                            event
                        )
                    }
                    body={
                        <ExperimentFinishedDialog
                            practiceMode={this.props.practiceMode}
                        />
                    }
                />
                <ModalDialog
                    id={`validation-dialog`}
                    visible={this.state.showingValidationDialog}
                    onDialogClicked={(event) => {
                        event.stopPropagation();
                    }}
                    onBackgroundClicked={() => {}}
                    body={
                        <ValidationErrorDialog
                            onDialogDismissed={this.onValidationDialogDismissed}
                        />
                    }
                />
            </div>
        );
    }

    onValidationDialogDismissed() {
        this.props.onUserDismissedValidation();
        this.validationLimitReached = true;
        this.setState({
            showingValidationDialog: false,
        });
        setTimeout(this.resetValidationLimit, 30000);
    }

    onWindowMessage(event) {
        console.debug("Got window message inside social media feed");
        console.debug(event.data);
        let event_type = event.data["event_type"];

        if (event_type == "user_continued_survey") {
            if (this.state.experimentFinished) {
                console.debug(
                    "Ignoring validation message because experiment already finished"
                );
                return;
            }

            console.debug("setting flag to validate emulator");
            $("html, body").animate({ scrollTop: 0 }, "slow");
            this.setState({
                showingEmulatorValidation: true,
                showingValidationDialog: true,
            });
        }
    }

    onStoryCompleted() {
        this.onDialogDismissed(this.state.postRepliesToView);
    }

    onTestUploaded(experimentEventRecord) {
        // TODO: Handle the test being uploaded, update whatever needs updating.
    }

    onQuizFinished(_) {
        this.setState({
            finishedQuiz: true,
            showingQuiz: false,
        });
    }

    onVerticalSeparatedStoryClicked(postId) {
        this.setState({
            modalId: postId,
            viewingVerticalStory: true,
            viewingReplies: true,
            postRepliesToView: this.state.posts[postId],
        });
    }

    onMultiChoiceAnswerChanged(postId, answer) {
        if (this.bottomValidationTimer != null) {
            console.debug(
                "Cancelling idle validation timer since user answered distractor task"
            );
            clearTimeout(this.bottomValidationTimer);
            this.bottomValidationTimer = null;
        }

        this.setState((state, _) => {
            this.userInteractionTracker.onMultiChoiceAnswerChanged(
                postId,
                answer
            );
            let posts = state.posts;
            posts[postId]["answer"] = answer;
            return {
                posts: posts,
            };
        });
    }

    onPriorKnowledgeChanged(postId, answer) {
        this.setState((state, _) => {
            this.userInteractionTracker.onPriorKnowledgeChanged(postId, answer);
            let posts = state.posts;
            posts[postId]["answer"] = answer;
            return {
                posts: posts,
            };
        });
    }

    onFillerQuestionClicked(postId) {
        console.debug(
            "[SOCIAL_MEDIA_FEED][ON_PRIOR_KNOWLEDGE_SUBMITTED] - postId = " +
                postId +
                " answer = " +
                true
        );

        let readTime = Date.now() - this.priorKnowledgeStartTime;
        this.userInteractionTracker.onPriorKnowledgeAnswered(
            Date.now(),
            postId,
            true,
            readTime
        );
        this.priorKnowledgeStartTime = Date.now();
        this.setState({
            showingKnowledgeCheck: false,
        });
    }

    onPriorKnowledgeSubmitted(postId, answer) {
        let cleanedAnswer = answer;

        if (cleanedAnswer === undefined || cleanedAnswer === null) {
            cleanedAnswer = 0;
        }

        console.debug(
            "[SOCIAL_MEDIA_FEED][ON_PRIOR_KNOWLEDGE_SUBMITTED] - postId = " +
                postId +
                " answer = " +
                cleanedAnswer
        );
        let readTime = Date.now() - this.priorKnowledgeStartTime;
        this.userInteractionTracker.onPriorKnowledgeAnswered(
            Date.now(),
            postId,
            cleanedAnswer,
            readTime
        );
        this.priorKnowledgeStartTime = Date.now();
        this.setState({
            showingKnowledgeCheck: false,
        });
    }

    onPostRepliesDismissed() {
        this.setState({
            viewingReplies: false,
            postRepliesToView: null,
        });
    }

    onStorySegmentRead(timestamp, postId, segmentNumber, readTime) {
        this.userInteractionTracker.onStorySegmentRead(
            timestamp,
            postId,
            segmentNumber,
            readTime
        );
    }

    onSeenClicked(id) {
        this.setState((state, _) => {
            this.userInteractionTracker.onSeenClicked(id);
            let posts = state.posts;
            posts[id]["answer"] = "seen";
            return {
                posts: posts,
            };
        });
    }

    onUniqueClicked(id) {
        this.setState((state, _) => {
            this.userInteractionTracker.onUniqueClicked(id);
            let posts = state.posts;
            posts[id]["answer"] = "unique";
            return {
                posts: posts,
            };
        });
    }

    onRepliesClicked(id) {
        console.debug(
            "[SOCIAL_MEDIA_FEED][EVENT][MOUSE] - View replies button clicked for " +
                id
        );
        this.setState({
            modalId: id,
            viewingReplies: true,
            postRepliesToView: this.state.posts[id],
        });
    }

    onNewsPostClicked(index) {
        console.debug("[SOCIAL_MEDIA_FEED][EVENT][MOUSE] - News post clicked!");
        this.setState({
            modalId: index,
            viewingReplies: true,
            postRepliesToView: this.state.posts[index],
        });
    }

    onDialogDismissed(_) {
        console.debug("[SOCIAL_MEDIA_FEED][EVENT][MOUSE] - Dialog Dismissed");
        if (this.state.viewingVerticalStory) {
            this.setState({
                showingKnowledgeCheck: true,
                viewingVerticalStory: false,
                viewingReplies: false,
                postRepliesToView: null,
            });
        } else {
            this.setState({
                modalId: 0,
                showingKnowledgeCheck: false,
                viewingVerticalStory: false,
                viewingReplies: false,
                postRepliesToView: null,
            });
        }
    }

    onDialogClicked(post, event) {
        console.debug("[SOCIAL_MEDIA_FEED][EVENT][MOUSE] - dialog clicked");
        event.stopPropagation();
    }

    onRequiredCriteriaMet() {
        this.props.onRequiredCriteriaMet();
    }

    onAllCriteriaMet() {
        this.props.onAllCriteriaMet();
        this.setState({
            experimentFinished: true,
        });
    }

    resetValidationLimit() {
        console.debug("Resetting validation limit");
        this.validationLimitReached = false;
    }

    showUserValidation() {
        // this.bottomValidationTimer = null;
        // if (this.state.viewingVerticalStory) {
        //   console.debug(
        //     "Ignoring user idle scroll event because we are viewing a vertical story"
        //   );
        //   return;
        // } else if (this.state.showingKnowledgeCheck) {
        //   console.debug(
        //     "Ignoring user idle scroll event because we are viewing knowledge check"
        //   );
        //   return;
        // } else if (this.state.showingValidationDialog) {
        //   console.debug(
        //     "Ignoring user idle scroll event because we are already showing validation dialog"
        //   );
        //   return;
        // } else if (this.state.showingEmulatorValidation) {
        //   console.debug(
        //     "Ignoring user idle scroll event because we have already shown emulator validation"
        //   );
        //   return;
        // } else if (this.state.experimentFinished) {
        //   console.debug(
        //     "Ignoring user idle scroll event because experiment has finished"
        //   );
        //   return;
        // } else if (this.props.practiceMode) {
        //   console.debug(
        //     "Ignoring user validation display because we are in practice mode"
        //   );
        //   return;
        // }
        // if (this.validationLimitReached) {
        //   console.debug(
        //     "Not showing user validation because validation limit reached"
        //   );
        //   return;
        // }
        // console.debug("Showing user validation");
        // $("html, body").animate({ scrollTop: 0 }, "slow");
        // this.validationLimitReached = true;
        // this.setState({
        //   showingEmulatorValidation: true,
        //   showingValidationDialog: true,
        // });
    }

    onUserReachedBottom() {
        if (this.bottomValidationTimer == null) {
            this.bottomValidationTimer = setTimeout(
                this.showUserValidation,
                15000
            );
        }
    }

    onUserLeftBottom() {
        // if (this.bottomValidationTimer != null) {
        //     clearTimeout(this.bottomValidationTimer);
        //     this.bottomValidationTimer = null;
        // }
    }

    onUserScrollIdle() {
        // this.showUserValidation();
    }
}
