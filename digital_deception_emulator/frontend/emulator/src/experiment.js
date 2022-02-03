import React from "react";
import { render } from "react-dom";
import { version } from "../package.json";

import { HeatmapRecord } from "./experiment_playback";
import { DigitalDeceptionDriver, DummyDigitalDeceptionDriver } from "./network";
import { PostDataProvider } from "./post_data_provider";
import { shuffle, range } from "./utils/randomization";
import { POST_DATA, findLongestSection } from "./stimuli/post_data";
import { PracticeCommentBank } from "./stimuli/comment_bank";
import CommentBank from "./stimuli/comment_bank";
import { PracticeCommentProvider } from "./stimuli/comment_provider";
import CommentProvider from "./stimuli/comment_provider";
import { PRACTICE_POST_DATA } from "./stimuli/practice_post_data";
import AuthorProvider from "./stimuli/author_provider";

console.debug("[STARTUP][experiment.js] - window.showHeatmap = " + window.showHeatmap);
console.debug("[STARTUP][experiment.js] - window.practiceMode = " + window.practiceMode);
console.debug("[STARTUP][experiment.js] - window.testId = " + window.testId);

// Expected test resolution: 1075x800px

// window.practiceMode = true;
// window.debugTutorialMode = true;
window.minScrollDelay = 1250;

let practiceMode = window.practiceMode !== undefined && window.practiceMode === true;
let showHeatmap = window.showHeatmap !== undefined && window.showHeatmap !== null && window.showHeatmap === true;
let testId = window.testId;
let heatmapData = [];

window.appVersion = version;

console.debug("Longest story segment length: " + findLongestSection());

let criteriaMetFunction = function () { };
let allCriteriaMetFunction = function () { };
let dismissedValidationFunction = function () {
    console.debug("fake posting user_dismissed_validation_message to parent");
};

if (parent.window !== undefined) {
    criteriaMetFunction = function () {
        parent.window.postMessage({
            "event_type": "emulator_criteria_met",
        }, "*");
    };
    allCriteriaMetFunction = function () {
        parent.window.postMessage({
            "event_type": "all_emulator_criteria_met",
        }, "*");
    }

    dismissedValidationFunction = function () {
        console.debug("Posting user_dismissed_validation_message to parent");
        parent.window.postMessage({ "event_type": "user_dismissed_validation" }, "*");
    }
}

if (showHeatmap) {
    for (let i = 0; i < window.heatmapData.length; i++) {
        let record = window.heatmapData[i];
        let heatmapRecord = new HeatmapRecord(
            record["event_data"]["time_offset"],
            record["event_data"]["x"],
            record["event_data"]["y"]);
        heatmapData.push(heatmapRecord);
    }
}

let serverDriver = new DigitalDeceptionDriver();

if (process.env.NODE_ENV !== "production" && !window.serverRunning) {
    console.debug("[STARTUP][experiment.js] - Enabling dummy server driver as we are in debug mode");
    serverDriver = new DummyDigitalDeceptionDriver();
    // practiceMode = true;
}


class PilotExperiment extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.practiceMode) {
            this.commentProvider = new PracticeCommentProvider(new PracticeCommentBank(), new AuthorProvider());
        } else {
            this.commentProvider = new CommentProvider(new CommentBank(), new AuthorProvider());
        }

        this.state = {
            newsStoryIds: [],
            distractorTaskIds: [],
        }

        this.onEmulatorInfoReceived = this.onEmulatorInfoReceived.bind(this);
    }

    componentDidMount() {
        window.addEventListener("message", this.onEmulatorInfoReceived);

        if (process.env.NODE_ENV !== "production") {
            console.debug("[STARTUP][experiment.js] - Emulating qualtrics message post with emulator info");
            let storyIds = [
                "goody-garlick",
                "turtles-on-treadmills",
                "irish-moss",
                "cuttlefish-vision",
                "twister",
                "skywalker-resort"
            ];

            let distractorTasks = shuffle(range(13, 1)).map(i => "distractor-task-" + i);

            if (window.debugTutorialMode) {
                distractorTasks = ["distractor-task-1"];
            }


            if (this.props.practiceMode) {
                storyIds = [
                    "stolen-shark"
                ];
                distractorTasks = [
                    distractorTasks[0]
                ];
            }

            window.postMessage({
                "event_type": "emulator_info",
                "story_ids": shuffle(storyIds),
                "distractor_tasks": distractorTasks,
            });

            let debugValidation = false;

            if (debugValidation) {
                setTimeout(function () {
                    console.debug("[STARTUP][experiment.js] - Posting emulator loaded message to the qualtrics survey");
                    window.parent.window.postMessage({
                        "event_type": "user_continued_survey"
                    }, "*");
                }, 1000)
            }
        }

        if (window.parent.window !== null) {
            // Need to tell the qualtrics survey when the emulator is loaded so that it knows when to post the story info.
            console.debug("[STARTUP][experiment.js] - Delaying post for 250ms");
            setTimeout(function () {
                console.debug("[STARTUP][experiment.js] - Posting emulator loaded message to the qualtrics survey");
                window.parent.window.postMessage({
                    "event_type": "emulator_loaded"
                }, "*");
            }, 750);
        }
    }

    onEmulatorInfoReceived(event) {
        console.debug("[STARTUP][FEED_GENERATION][experiment.js] - Emulator got message from qualtrics script");
        let event_type = event.data["event_type"];

        if (event_type === "emulator_info") {
            console.debug("[FEED_GENERATION] - Got news story order from the survey");
            console.debug(`[FEED_GENERATION] - ${event.data["story_ids"]}`);

            let storyIds = event.data["story_ids"];
            let distractorTaskIds = event.data["distractor_tasks"];

            this.setState({
                newsStoryIds: storyIds,
                distractorTaskIds: distractorTaskIds,
            });
        }
    }

    render() {
        if (this.state.newsStoryIds.length <= 0) {
            return <div />;
        }

        let actualPosts = [];
        let actualPostIds = [];

        for (let i = 0; i < this.state.newsStoryIds.length; i++) {
            let newsStoryId = this.state.newsStoryIds[i];
            let distractorTaskIndex = i;

            if (!practiceMode) {
                distractorTaskIndex += 2;
            }

            let distractorTaskId = this.state.distractorTaskIds[distractorTaskIndex % this.state.distractorTaskIds.length];
            let newsStory = this.props.posts[newsStoryId];
            let distractorTask = this.props.posts[distractorTaskId];

            console.debug(`[FEED_GENERATION] - \norder ${i} \nnewsStoryId = ${newsStoryId} newsStory = ${newsStory}`);
            console.debug(`[FEED_GENERATION] - distractorTaskId = ${distractorTaskId} distractorTask = ${distractorTask} distractorTaskIndex = ${distractorTaskIndex}`);

            if (newsStory === undefined) {
                console.debug(`[FEED_GENERATION] - newStory was undefined, skipping.`);
                continue;
            }

            newsStory["comments"] = this.commentProvider.getCommentsForPost(newsStory);

            actualPosts.push(newsStory);
            actualPostIds.push(newsStoryId);

            if (i < this.state.newsStoryIds.length - 1 || this.state.newsStoryIds.length === 1) {
                if (distractorTask === undefined) {
                    console.debug("[FEED_GENERATION] - distractor task was undefined, skipping.");
                    continue;
                }

                actualPosts.push(distractorTask);
                actualPostIds.push(distractorTaskId);
            }
        }

        if (!practiceMode) {
            let lastDistractorIndex = this.state.newsStoryIds.length + 1;

            console.debug(`[FEED_GENERATION] - Adding distractor task number ${lastDistractorIndex} to have a distractor at the end of the experiment.`);

            let distractorId = this.state.distractorTaskIds[lastDistractorIndex % this.state.distractorTaskIds.length];
            let distractorTask = this.props.posts[distractorId];

            console.debug(`[FEED_GENERATION] - last distractor task id = ${distractorId}`)

            actualPosts.push(distractorTask);
            actualPostIds.push(distractorId);
        }

        console.debug("[STARTUP][FEED_GENERATION][emulator.js] - Emulator has posts and rendering feed: ");
        console.debug(actualPosts);

        return <PostDataProvider
            showHeatmap={showHeatmap}
            heatmapData={heatmapData}
            testId={testId}
            heatmapYOffset={0}
            serverDriver={serverDriver}
            posts={actualPosts}
            practiceMode={this.props.practiceMode}
            requiredResponsePosts={this.state.newsStoryIds}
            onUserDismissedValidation={dismissedValidationFunction}
            onAllCriteriaMet={allCriteriaMetFunction}
            onRequiredCriteriaMet={criteriaMetFunction} />;
    }
}

let postMap = {};
let postArray = POST_DATA;

if (practiceMode) {
    console.debug("Practice Mode enabled, using the practice post data instead");
    console.debug(PRACTICE_POST_DATA);
    postArray = PRACTICE_POST_DATA;
} else {
    console.debug("Not practice mode, sending the regular post data");
}

for (let i = 0; i < postArray.length; i++) {
    let post = postArray[i];
    postMap[post.id] = post;
}

render(<PilotExperiment posts={postMap}
    practiceMode={practiceMode} />, document.getElementById("root"));
