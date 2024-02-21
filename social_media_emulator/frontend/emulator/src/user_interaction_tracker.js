import $ from "jquery";
import {
    ExperimentFinishedEvent,
    ExperimentTestRecord,
    MouseClickedElementRecord,
    MouseEnteredElementRecord,
    MouseLeftElementRecord,
    MouseMoveEvent,
    MultiChoiceAnswerChanged,
    PostCameIntoViewEventRecord,
    PostLeftViewEventRecord,
    PostRepliesClosed,
    PostRepliesOpened, PriorKnowledgeAnswerChanged,
    PriorKnowledgeAnswered,
    ReplyCameIntoView,
    ReplyLeftView, RequiredResponseCriteriaMet,
    StorySegmentRead,
    UnhandledError,
    UserScrolledFeedEventRecord,
    UserScrolledPopupEventRecord,
    UserScrolledRepliesEventRecord
} from "./experiment_event";
import ElementScrollTracker from "./element_scroll_tracker";
import { HeatmapTracker } from "./experiment_playback";

const autoBind = require("auto-bind");

const interaction_types = [
    "USER_SCROLLED_FEED",
    "USER_SCROLLED_POPUP",
    "USER_SCROLLED_REPLIES",
    "POST_CAME_INTO_VIEW",
    "POST_LEFT_VIEW",
    "POST_REPLIES_OPENED",
    "POST_REPLIES_CLOSED",
    "POST_REPLY_CAME_INTO_VIEW",
    "POST_REPLY_LEFT_VIEW",
    "MOUSE_ENTERED_ELEMENT",
    "MOUSE_LEFT_ELEMENT",
    "MOUSE_CLICKED_ELEMENT",
    "MOUSE_MOVED",
    "UNHANDLED_ERROR",
];


export class UserInteractionTracker {
    constructor(serverDriver,
        onTestUploaded,
        showHeatmap,
        posts,
        requiredResponsePostIds,
        onRequiredCriteriaMet,
        onAllCriteriaMet,
        onUserReachedBottom,
        onUserLeftBottom,
        onUserScrollIdle) {
        autoBind(this);

        this.tracking = false;
        this.currentBatch = [];
        this.batchBuffer = [];
        this.serverDriver = serverDriver;
        this.experimentTestRecord = null;
        this.onTestUploadedHandler = onTestUploaded;
        this.lastMouseEnteredTimestamp = null;
        this.experimentConfigured = null;
        this.showHeatmap = showHeatmap;
        this.modalPostScrollTracker = null;
        this.mouseMovedCounter = 0;
        this.postingBatch = false;
        this.requiredResponsePostIds = requiredResponsePostIds;
        this.posts = posts;
        this.parentOnRequiredCriteriaMet = onRequiredCriteriaMet;
        this.parentOnAllCriteriaMet = onAllCriteriaMet;
        this.onUserReachedBottom = onUserReachedBottom;
        this.onUserLeftBottom = onUserLeftBottom;
        this.onUserScrollIdle = onUserScrollIdle;

        this.postScrollTracker = null;
        this.modalPostScrollTracker = null;
        this.modalReplyScrollTracker = null;
        this.heatmapTracker = new HeatmapTracker(this.onHeatmapBatchReady);
        this.hasHitBottom = false;
        this.idleValidationTimer = setTimeout(this.onUserScrollIdle, 5000);
    }

    startTracking(subjectId) {
        if (this.showHeatmap) {
            console.debug("[USER_INTERACTION] - Showing heatmap, so not enabling user interaction tracking");
            return;
        }

        console.debug("[USER_INTERACTION] - Starting user interaction tracking");
        console.debug("[USER_INTERACTION] - subjectId = " + subjectId);

        this.testStartTimestamp = Date.now();
        this.experimentTestRecord = new ExperimentTestRecord(Date.now(), subjectId, null, this.posts);

        this.serverDriver.putExperimentTest(this.experimentTestRecord).then(data => {
            // Reload the experiment test record from json.
            this.experimentTestRecord.fromJSON(data[0]);
            this.onTestUploadedHandler(this.experimentTestRecord);
            this._actualStartTracking();
        });
    }

    _actualStartTracking() {
        console.debug("[USER_INTERACTION_TRACKER][START_TRACKING] - Registering all event listeners");
        this.tracking = true;

        let feedContainer = $("#feedContainer");

        feedContainer.on("click", this.onMouseClickedElement);
        feedContainer.on("mouseover", "div:not(#feedContainer)", this.onMouseEnteredElement);
        feedContainer.on("mouseout", "div:not(#feedContainer)", this.onMouseLeftElement);
        // feedContainer.on("scroll", this.onUserScrolledFeed)

        $(".modal-post-container").on("click", this.onMouseClickedElement);

        window.addEventListener("error", (event) => {
            this.onError(event);
        })
        window.addEventListener("scroll", (event) => {
            this.onUserScrolledFeed(event);
        });
        window.addEventListener("mousemove", (event) => {
            this.onMouseMoved(event);
        });

        let elementScrollTracker = new ElementScrollTracker(null,
            (element, timestamp) => {
                this.onPostCameIntoView(element, timestamp);
            },
            (element, timestampLeft, timestampEntered) => {
                this.onPostLeftView(element, timestampLeft, timestampEntered)
            });

        $(document).ready(function () {
            elementScrollTracker.trackElements(".post-container");
        });

        this.postScrollTracker = elementScrollTracker;
    }

    stopTracking() {
        if (!this.tracking) {
            return;
        }

        this.tracking = false;
        window.removeEventListener("error", this.onError);
        window.removeEventListener("mousemove", this.onMouseMoved);
        window.removeEventListener("scroll", this.onUserScrolledFeed);
    }

    trackEvent(event) {
        if (!this.tracking) {
            return;
        }

        if (this.postingBatch) {
            this.batchBuffer.push(event);
        } else {
            this.currentBatch.push(event);

            if (this.currentBatch.length >= 100) {
                this.postBatchToServer();
            }
        }
    }

    postBatchToServer() {
        if (this.postingBatch) {
            // Prevent concurrent batch post requests where events come in while the batch is being posted.
            return;
        }

        console.debug("[USER_INTERACTION][BATCH] - Posting user interaction batch to server");
        this.batchBuffer = [];
        this.postingBatch = true;

        this.serverDriver.putExperimentEventRecords(this.currentBatch, this.experimentTestRecord.id).then(data => {
            // When we're done posting the batch to the server, swap out the batch buffer and the batch array.
            console.debug("Replacing the current batch with the batch buffer");
            this.currentBatch = this.batchBuffer;
            this.batchBuffer = [];
            this.postingBatch = false;
        });
    }

    onHeatmapBatchReady(heatmapData) {
        if (this.showHeatmap) {
            return;
        }

        console.debug("[USER_INTERACTION][EVENT][HEATMAP][BATCH_READY] - Got heatmap batch ready");
        this.serverDriver.putHeatmapRecords(heatmapData, this.experimentTestRecord.id);
        this.heatmapTracker.heatmapData = [];
    }

    onUniqueClicked(id) {
        console.debug("[USER_INTERACTION][EVENT][MOUSE][UNIQUE_BUTTON] - Got unique button clicked " + id);
        this.posts[id]["answer"] = "unique";
    }

    onSeenClicked(id) {
        console.debug("[USER_INTERACTION][EVENT][MOUSE][SEEN_BUTTON] - Got seen button clicked " + id);
        this.posts[id]["answer"] = "seen";
    }

    onUserScrolledFeed(event) {
        let thisWindow = $(window);
        let offsetX = thisWindow.scrollLeft();
        let offsetY = thisWindow.scrollTop();
        let timestamp = Date.now();
        let timeOffset = timestamp - this.experimentTestRecord.timestamp;
        let record = new UserScrolledFeedEventRecord(timestamp, timeOffset, offsetX, offsetY);
        this.trackEvent(record);
        console.debug("[USER_INTERACTION][EVENT][SCROLL][FEED] - Got user scrolled feed event " + offsetX + ", " + offsetY);

        if (this.idleValidationTimer != null) {
            clearTimeout(this.idleValidationTimer);
            this.idleValidationTimer = null;
        }

        this.idleValidationTimer = setTimeout(this.onUserScrollIdle, 5000);

        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            if (this.hasHitBottom) {
                return;
            } else {
                this.hasHitBottom = true;
                this.onUserReachedBottom();
            }
        } else if (this.hasHitBottom) {
            // We were previously at the bottom and now we aren't anymore.
            this.hasHitBottom = false;
            this.onUserLeftBottom();
        }
    }

    onUserScrolledPopup(event) {
        let offsetX = event.target.scrollLeft;
        let offsetY = event.target.scrollTop;
        let timestamp = Date.now();
        let timeOffset = timestamp - this.experimentTestRecord.timestamp;
        let record = new UserScrolledPopupEventRecord(timestamp, timeOffset, offsetX, offsetY);
        this.trackEvent(record);
        console.debug("[USER_INTERACTION][EVENT][SCROLL][POPUP] - Got user scrolled popup event " + offsetX + ", " + offsetY);
    }

    onUserScrolledReplies(event) {
        let offsetX = event.target.scrollLeft;
        let offsetY = event.target.scrollTop;
        let timestamp = Date.now();
        let timeOffset = timestamp - this.experimentTestRecord.timestamp;
        let record = new UserScrolledRepliesEventRecord(timestamp, timeOffset, offsetX, offsetY);
        this.trackEvent(record);
        console.debug("[USER_INTERACTION][EVENT][SCROLL][POPUP][REPLIES] - Got user scrolled replies event " + event.target.id);
    }

    onPostCameIntoView(element, timestamp) {
        let record = new PostCameIntoViewEventRecord(timestamp, element);
        this.trackEvent(record);
        console.debug("[USER_INTERACTION][EVENT][SCROLL][POPUP][POST_CAME_INTO_VIEW] - Got post came into view event " + element.id);
    }

    onPostLeftView(element, timestampLeft, timestampEntered) {
        console.debug("[USER_INTERACTION][EVENT][SCROLL][POPUP][POST_LEFT_VIEW] - Got post left view event " + element.id);
        let record = new PostLeftViewEventRecord(timestampLeft, element, timestampEntered);
        this.trackEvent(record);
    }

    onPostRepliesOpened(postId) {
        let timestamp = Date.now();
        let record = new PostRepliesOpened(timestamp, postId);
        this.trackEvent(record);
        console.debug("[USER_INTERACTION][EVENT][MOUSE][POPUP][OPENED] - Got post replies opened event " + postId);
        let modalPostContainer = $(".modal-post-container");

        this.modalPostScrollTracker = new ElementScrollTracker(modalPostContainer[0],
            (element, timestamp) => {
                this.onModalPostElementCameIntoView(element, timestamp)
            },
            (element, timestampLeft, timestampEntered) => {
                this.onModalPostElementLeftView(element, timestampLeft, timestampEntered)
            });
        this.modalPostScrollTracker.trackElements(".modal-post-title,.modal-post-body,.modal-replies-body");

        modalPostContainer.on("scroll", this.onUserScrolledPopup);
    }

    onPostRepliesClosed(postId) {
        let timestamp = Date.now();
        let record = new PostRepliesClosed(timestamp, postId);
        this.trackEvent(record);
        console.debug("[USER_INTERACTION][EVENT][MOUSE][POPUP][CLOSED] - Got post replies closed event " + postId);

        this.modalPostScrollTracker.stopTracking();
        this.modalPostScrollTracker = null;
    }

    onPostReplyCameIntoView(element, timestamp) {
        let record = new ReplyCameIntoView(timestamp, element);
        this.trackEvent(record);
        console.debug("[USER_INTERACTION][EVENT][SCROLL] - Got post reply came into view event " + element.id);
    }

    onPostReplyLeftView(element, timestampLeft, timestampEntered) {
        let record = new ReplyLeftView(timestampLeft, element, timestampEntered);
        this.trackEvent(record);
        console.debug("[USER_INTERACTION][EVENT][SCROLL] - Got post reply left view event " + element.id);
    }

    onMouseEnteredElement(event) {
        event.stopPropagation();
        this.lastMouseEnteredTimestamp = Date.now();
        let record = new MouseEnteredElementRecord(this.lastMouseEnteredTimestamp, event.target);
        this.trackEvent(record);
        // console.debug("[USER_INTERACTION][EVENT][MOUSE] - Got mouse entered element event " + event.target.id);
    }

    onMouseLeftElement(event) {
        event.stopPropagation();
        let timestampLeft = Date.now();
        let record = new MouseLeftElementRecord(timestampLeft, event.target, this.lastMouseEnteredTimestamp);
        this.trackEvent(record);
        // console.debug("[USER_INTERACTION][EVENT][MOUSE] - Got mouse left element event " + event.target.id);
    }

    onMouseClickedElement(event) {
        let timestamp = Date.now();
        let record = new MouseClickedElementRecord(timestamp, event.target);
        this.trackEvent(record);
        console.debug("[USER_INTERACTION][EVENT][MOUSE] - Got mouse clicked element event " + event.target.id + " - " + event.target.className);
    }

    onMouseMoved(event) {
        this.mouseMovedCounter += 1;

        if (this.mouseMovedCounter <= 50) {
            return;
        }

        let x = event.pageX;
        let y = event.pageY;
        let timestamp = Date.now();
        let record = new MouseMoveEvent(timestamp, x, y);
        this.trackEvent(record);
        // console.debug("[USER_INTERACTION][EVENT][MOUSE][MOVE] - Got mouse moved event " + x + ", " + y);
    }

    onError(event) {
        let timestamp = Date.now();
        let record = new UnhandledError(event.message, event.source, event.lineno, event.colno);
        this.trackEvent(record);
        console.debug("[USER_INTERACTION][ERROR] - Unhandled error occured during experiment: " + message);
        console.debug("[USER_INTERACTION][ERROR] - Source: " + source + " -- line number: " + event.lineno);
        console.debug("[USER_INTERACTION][ERROR] - Error was reported to server for debugging");
    }

    onModalPostElementCameIntoView(element, timestamp) {
        console.debug("[USER_INTERACTION][EVENT][SCROLL][POPUP][ELEMENT_ENTERED_VIEW] - onModalPostElementCameIntoView() top element: " + element.id);
        if (element.id.endsWith("modal-replies-body")) {
            this.modalReplyScrollTracker = new ElementScrollTracker($(".modal-replies-height-container")[0],
                (element, timestamp) => {
                    this.onPostReplyCameIntoView(element, timestamp);
                },
                (element, timestampLeft, timestampEntered) => {
                    this.onPostReplyLeftView(element, timestampLeft, timestampEntered);
                });
            this.modalReplyScrollTracker.trackElements(".modal-reply-container");
        }
    }

    onModalPostElementLeftView(element, timestampLeft, timestampEntered) {
        console.debug("[USER_INTERACTION][EVENT][SCROLL][POPUP][ELEMENT_LEFT_VIEW] - onModalPostLeftView() top element: " + element.id);
        if (element.id.endsWith("modal-replies-body")) {
            this.modalReplyScrollTracker.stopTracking();
            this.modalReplyScrollTracker = null;
        }
    }

    onMultiChoiceAnswerChanged(id, answer) {
        console.debug("[USER_INTERACTION_TRACKER][MULTI_CHOICE_ANSWER_CHANGED] Got Multi Choice Answer Changed Event");
        console.debug("[USER_INTERACTION_TRACKER][MULTI_CHOICE_ANSWER_CHANGED] id = " + id);
        let record = new MultiChoiceAnswerChanged(Date.now(), id, answer);
        this.trackEvent(record);
        this.posts[id]["answer"] = answer;
        this.checkAllPosts();
    }

    onPriorKnowledgeChanged(id, answer) {
        console.debug("[USER_INTERACTION_TRACKER][PRIOR_KNOWLEDGE_ANSWER_CHANGED] Got Prior Knowledge Answer Changed Event");
        console.debug("[USER_INTERACTION_TRACKER][PRIOR_KNOWLEDGE_ANSWER_CHANGED] id = " + id);
        let record = new PriorKnowledgeAnswerChanged(Date.now(), id, answer);
        this.trackEvent(record);
        this.posts[id]["answer"] = answer;
        // this.checkRequiredPosts();
    }

    onPriorKnowledgeAnswered(timestamp, storyId, answer, readTime) {
        console.debug("[USER_INTERACTION_TRACKER][PRIOR_KNOWLEDGE_ANSWERED] Got Prior Knowledge Answered Event");
        console.debug("[USER_INTERACTION_TRACKER][PRIOR_KNOWLEDGE_ANSWERED] id = " + storyId);
        let record = new PriorKnowledgeAnswered(timestamp, storyId, answer, readTime);
        this.trackEvent(record);
        this.posts[storyId]["answer"] = answer;
        this.checkAllPosts();
    }

    onStorySegmentRead(timestamp, storyId, segmentNumber, readTime) {
        console.debug("[USER_INTERACTION_TRACKER][STORY_SEGMENT_READ] Got Story Segment Read Event");
        console.debug("[USER_INTERACTION_TRACKER][STORY_SEGMENT_READ] id = " + storyId + " read time = " + readTime + " segment number = " + segmentNumber);
        let record = new StorySegmentRead(timestamp, storyId, segmentNumber, readTime);
        this.trackEvent(record);
    }

    checkAllPosts() {
        let postIds = Object.keys(this.posts);

        for (let i = 0; i < postIds.length; i++) {
            let id = postIds[i];
            let post = this.posts[id];

            if (post === undefined || post === null) {
                // TODO: Determine how to handle the tasks that aren't shown here. They should just be ignored right?
                console.debug(`[USER_INTERACTION_TRACKER][REQUIRED_CRITERIA_CHECK] - Ignoring non-existant post id ${id}`);
                continue;
            }

            if (post.answer === null || post.answer === undefined) {
                console.debug(`[USER_INTERACTION_TRACKER][REQUIRED_CRITERIA_CHECK] question ${id} answer was null, not finished yet`);
                return this.checkRequiredPosts();
            } else {
                console.debug(`[USER_INTERACTION_TRACKER][REQUIRED_CRITERIA_CHECK] question ${id} answer = ${post.answer}`);
            }
        }

        this.onAllCriteriaMet();
    }

    checkRequiredPosts() {
        for (let i = 0; i < this.requiredResponsePostIds.length; i++) {
            let id = this.requiredResponsePostIds[i];

            console.debug("[USER_INTERACTION_TRACKER][REQUIRED_CRITERIA_CHECK] checking response for required question id " + id);
            console.debug("[USER_INTERACTION_TRACKER][REQUIRED_CRITERIA_CHECK] posts = " + this.posts);

            let post = this.posts[id];

            if (post === undefined || post === null) {
                // TODO: Determine how to handle the tasks that aren't shown here. They should just be ignored right?
                console.debug(`[USER_INTERACTION_TRACKER][REQUIRED_CRITERIA_CHECK] - Ignoring non-existant post id ${id}`);
                continue;
            }

            if (post.answer === null || post.answer === undefined) {
                console.debug(`[USER_INTERACTION_TRACKER][REQUIRED_CRITERIA_CHECK] question ${id} answer was null, not finished yet`);
                return;
            } else {
                console.debug(`[USER_INTERACTION_TRACKER][REQUIRED_CRITERIA_CHECK] question ${id} answer = ${post.answer}`);
            }
        }

        let record = new RequiredResponseCriteriaMet(Date.now());
        this.trackEvent(record);
        console.debug(`[USER_INTERACTION_TRACKER][REQUIRED_CRITERIA_CHECK] all required questions answered, finishing`);
        this.onRequiredCriteriaMet();
        this.postBatchToServer();
    }

    onRequiredCriteriaMet() {
        this.parentOnRequiredCriteriaMet();
    }

    onAllCriteriaMet() {
        let record = new ExperimentFinishedEvent(Date.now());
        this.trackEvent(record);
        this.postBatchToServer(); // Since this is the last event we should track, post the batch just to make sure it posts.
        this.parentOnAllCriteriaMet();
        this.stopTracking();
    }
}
