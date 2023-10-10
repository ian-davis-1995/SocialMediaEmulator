import React from "react";
import { render } from "react-dom";
import { version } from "../package.json";

import { DigitalDeceptionDriver, DummyDigitalDeceptionDriver } from "./network";
import { HeatmapRecord } from "./experiment_playback";
import { PostDataProvider } from "./post_data_provider";
import { shuffle, range } from "./utils/randomization";

import { POST_DATA, findLongestSection } from "./stimuli/post_data";
import { PracticeCommentBank } from "./stimuli/comment_bank";
import { PracticeCommentProvider } from "./stimuli/comment_provider";
import { PRACTICE_POST_DATA } from "./stimuli/practice_post_data";

import CommentBank from "./stimuli/comment_bank";
import CommentProvider from "./stimuli/comment_provider";
import AuthorProvider from "./stimuli/author_provider";

console.debug(
    "[STARTUP][experiment.js] - window.showHeatmap = " + window.showHeatmap
);
console.debug(
    "[STARTUP][experiment.js] - window.practiceMode = " + window.practiceMode
);
console.debug("[STARTUP][experiment.js] - window.testId = " + window.testId);

// Expected test resolution: 1075x800px

// window.practiceMode = true;
// window.debugTutorialMode = true;
window.minScrollDelay = 1250;

let debug = window.debug;
let practiceMode =
    window.practiceMode !== undefined && window.practiceMode === true;
let showHeatmap =
    window.showHeatmap !== undefined &&
    window.showHeatmap !== null &&
    window.showHeatmap === true;
let testId = window.testId;
let heatmapData = [];

window.appVersion = version;

console.debug("Longest story segment length: " + findLongestSection());

let criteriaMetFunction = function () {};
let allCriteriaMetFunction = function () {};
let dismissedValidationFunction = function () {
    console.debug("fake posting user_dismissed_validation_message to parent");
};

if (parent.window !== undefined) {
    criteriaMetFunction = function () {
        parent.window.postMessage(
            {
                event_type: "emulator_criteria_met",
            },
            "*"
        );
    };
    allCriteriaMetFunction = function () {
        parent.window.postMessage(
            {
                event_type: "all_emulator_criteria_met",
            },
            "*"
        );
    };

    dismissedValidationFunction = function () {
        console.debug("Posting user_dismissed_validation_message to parent");
        parent.window.postMessage(
            { event_type: "user_dismissed_validation" },
            "*"
        );
    };
}

if (showHeatmap) {
    for (let i = 0; i < window.heatmapData.length; i++) {
        let record = window.heatmapData[i];
        let heatmapRecord = new HeatmapRecord(
            record["event_data"]["time_offset"],
            record["event_data"]["x"],
            record["event_data"]["y"]
        );
        heatmapData.push(heatmapRecord);
    }
}

let serverDriver = new DigitalDeceptionDriver();

if (process.env.NODE_ENV !== "production" && !window.serverRunning) {
    console.debug(
        "[STARTUP][experiment.js] - Enabling dummy server driver as we are in debug mode"
    );
    serverDriver = new DummyDigitalDeceptionDriver();
    // practiceMode = true;
}

class PilotExperiment extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.practiceMode) {
            this.commentProvider = new PracticeCommentProvider(
                new PracticeCommentBank(),
                new AuthorProvider()
            );
        } else {
            this.commentProvider = new CommentProvider(
                new CommentBank(),
                new AuthorProvider()
            );
        }

        this.onEmulatorInfoReceived = this.onEmulatorInfoReceived.bind(this);
    }

    componentDidMount() {
        window.addEventListener("message", this.onEmulatorInfoReceived);

        if (process.env.NODE_ENV !== "production" || debug) {
            console.debug(
                "[STARTUP][experiment.js] - Emulating qualtrics message post with emulator info"
            );
            let storyIds = [
                "turtles-on-treadmills",
                "irish-moss",
                "cuttlefish-vision",
                "skywalker-resort",
            ];

            let distractorTasks = shuffle(range(10, 1)).map(
                (i) => "distractor-task-" + i
            );

            if (window.debugTutorialMode) {
                distractorTasks = ["distractor-task-1"];
            }

            if (this.props.practiceMode) {
                storyIds = ["stolen-shark"];
                distractorTasks = [distractorTasks[0]];
            }

            console.debug(
                `posting emulator_info message with storyIds: ${storyIds}`
            );
            window.postMessage({
                event_type: "emulator_info",
                story_ids: shuffle(storyIds),
                distractor_tasks: distractorTasks,
            });

            let debugValidation = false;

            if (debugValidation) {
                setTimeout(function () {
                    console.debug(
                        "[STARTUP][experiment.js] - Posting emulator loaded message to the qualtrics survey"
                    );
                    window.parent.window.postMessage(
                        {
                            event_type: "user_continued_survey",
                        },
                        "*"
                    );
                }, 1000);
            }
        }

        if (window.parent.window !== null) {
            // Need to tell the qualtrics survey when the emulator is loaded so that it knows when to post the story info.
            console.debug("[STARTUP][experiment.js] - Delaying post for 250ms");
            setTimeout(function () {
                console.debug(
                    "[STARTUP][experiment.js] - Posting emulator loaded message to the qualtrics survey"
                );
                window.parent.window.postMessage(
                    {
                        event_type: "emulator_loaded",
                    },
                    "*"
                );
            }, 750);
        }
    }

    onEmulatorInfoReceived(event) {
        console.debug(
            "[STARTUP][FEED_GENERATION][experiment.js] - Emulator got message from qualtrics script"
        );
        let event_type = event.data["event_type"];

        if (event_type === "emulator_info") {
            console.debug(
                "[FEED_GENERATION] - Got news story order from the survey"
            );
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
        console.debug(
            "[STARTUP][FEED_GENERATION][emulator.js] - Emulator has posts and rendering feed: "
        );
        console.debug(this.props.posts);

        const postsWithComments = POST_DATA.map((post) => {
            post["category"] = "historic";
            const replies = this.commentProvider.getCommentsForPost(post);
            post["replies"] = replies;
            console.debug("picking comments for post", post);
            return post;
        });

        return (
            <PostDataProvider
                showHeatmap={showHeatmap}
                heatmapData={heatmapData}
                testId={testId}
                heatmapYOffset={0}
                serverDriver={serverDriver}
                posts={postsWithComments}
                practiceMode={this.props.practiceMode}
                requiredResponsePosts={[]}
                onUserDismissedValidation={dismissedValidationFunction}
                onAllCriteriaMet={allCriteriaMetFunction}
                onRequiredCriteriaMet={criteriaMetFunction}
            />
        );
    }
}

let postMap = {};
let postArray = POST_DATA;

if (practiceMode) {
    console.debug(
        "Practice Mode enabled, using the practice post data instead"
    );
    console.debug(PRACTICE_POST_DATA);
    postArray = PRACTICE_POST_DATA;
} else {
    console.debug("Not practice mode, sending the regular post data");
}

for (let i = 0; i < postArray.length; i++) {
    let post = postArray[i];
    postMap[post.id] = post;
}

render(
    <PilotExperiment posts={postMap} practiceMode={practiceMode} />,
    document.getElementById("root")
);
