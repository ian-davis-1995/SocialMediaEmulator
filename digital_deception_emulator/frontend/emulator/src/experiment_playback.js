import React from "react";
import simpleheat from "simpleheat/simpleheat";
import "./css/heatmap.css";
import {
    ExperimentEventRecord,
    MouseClickedElementRecord,
    MouseEnteredElementRecord,
    UserScrolledFeedEventRecord, UserScrolledPopupEventRecord, UserScrolledRepliesEventRecord
} from "./experiment_event";
import $ from "jquery";

export class HeatmapRecord extends ExperimentEventRecord {
    constructor(timeOffset, x, y) {
        super(Date.now(), "heatmap_mouse_event", {
            "time_offset": timeOffset,
            "x": x,
            "y": y,
        });

        this.timeOffset = timeOffset;
        this.x = x;
        this.y = y;
    }

    toArray(yOffset=0) {
        return [this.x, this.y + yOffset, 1];
    }

    toString() {
        return "new HeatmapRecord(" + this.timeOffset + ", " + this.x + ", " + this.y + ");";
    }

    toObject() {
        return {
            "time_offset": this.timeOffset,
            "x": this.x,
            "y": this.y,
        };
    }
}


export class HeatmapTracker {
    constructor(onBatchReady) {
        this.heatmapData = [];
        this.initialTimestamp = 0;
        this.onBatchReady = onBatchReady;
        this.onMouseMoved = this.onMouseMoved.bind(this);
    }

    startTracking() {
        this.initialTimestamp = Date.now();
        window.addEventListener("mousemove", this.onMouseMoved);
    }

    stopTracking() {
        window.removeEventListener("mousemove", this.onMouseMoved);
    }

    onMouseMoved(event) {
        let record = new HeatmapRecord(Date.now() - this.initialTimestamp, event.pageX, event.pageY);
        this.heatmapData = this.heatmapData.concat(record);

        if (this.heatmapData.length >= 100) {
            console.debug("[HEATMAP_VISUALIZATION][EVENT][BATCH_READY] - Posting heatmap batch of 100 records to server");
            this.onBatchReady(this.heatmapData);
            this.heatmapData = [];
            // We shouldn't be resetting the initial timestamp here as this is just the batch processing mechanism.
            // this.initialTimestamp = Date.now();
        }
    }

    toJSON(test_id) {
        let jsonData = [];

        for (let i=0; i < this.heatmapData.length; i++) {
            let record = this.heatmapData[i];
            jsonData = jsonData.concat(record.toJSON(test_id));
        }

        return {
            "initialTimestamp": this.initialTimestamp,
            "data": jsonData,
        };
    }
}


export class ExperimentPlayback extends React.Component {
    constructor(props) {
        super(props);

        this.onWindowResized = this.onWindowResized.bind(this);
        this.handleHeatmapRecord = this.handleHeatmapRecord.bind(this);
        this.handleMouseClickRecord = this.handleMouseClickRecord.bind(this);
        this.handleScrolledFeedRecord = this.handleScrolledFeedRecord.bind(this);
        this.handleScrolledPopupRecord = this.handleScrolledPopupRecord.bind(this);
        this.draw = this.draw.bind(this);

        // noinspection JSUnresolvedVariable
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        this.canvas = React.createRef();
        this.heatmap = null;
        this.animationStart = 0;
        this.state = {
            canvasWidth: 100,
            canvasHeight: 100,
        };
    }

    componentDidMount() {
        this.onWindowResized();
        window.addEventListener("resize", this.onWindowResized);
        window.addEventListener("mousemove", this.onMouseMoved);
        this.heatmap = simpleheat("heatmap-visualization").max(8);

        if (this.props.showHeatmap) {
            this.startAnimation();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResized);
        window.removeEventListener("mousemove", this.onMouseMoved);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.heatmap = simpleheat("heatmap-visualization").max(8);
    }

    render() {
        return (
            <canvas id={"heatmap-visualization"}
                    width={this.state.canvasWidth} height={this.state.canvasHeight} ref={this.canvas}/>
        );
    }

    startAnimation() {
        window.requestAnimationFrame(this.draw);
    }

    draw(timestamp) {
        console.groupCollapsed("heatmap_visualization_draw");
        let logPrefix = "[HEATMAP_VISUALIZATION][EVENT][DRAW] - ";
        console.debug(logPrefix + "Starting draw");

        if (this.animationStart === 0) {
            console.debug(logPrefix + "setting animationStart to " + timestamp + " as animation just began");
            this.animationStart = timestamp;
        }

        let context = this.canvas.current.getContext("2d");
        context.width = this.state.canvasWidth;
        context.height = this.state.canvasHeight;
        console.debug(logPrefix + "setting canvas size to " + this.state.canvasWidth + ", " + this.state.canvasHeight);

        let elapsed = timestamp - this.animationStart;
        let finished = true;

        this.heatmap.clear();

        console.debug(logPrefix + "time elapsed since last frame: " + elapsed);

        for (let i=0; i < this.props.data.length; i++) {
            let record = this.props.data[i];

            if (record.event_data.time_offset === undefined) {
                continue;
            }

            console.debug(logPrefix + "record timeOffset is " + record.event_data.time_offset);

            if (record.event_data.time_offset > elapsed) {
                console.debug(logPrefix + "record timeOffset was greater than elapsed time, stopping animation and restarting");
                finished = false;
                break;
            }

            if (record instanceof HeatmapRecord) {
                this.handleHeatmapRecord(logPrefix, record);
            } else if (record instanceof MouseClickedElementRecord) {
                this.handleMouseClickRecord(logPrefix, record);
            } else if (record instanceof UserScrolledFeedEventRecord) {
                this.handleScrolledFeedRecord(logPrefix, record);
            } else if (record instanceof UserScrolledPopupEventRecord) {
                this.handleScrolledPopupRecord(logPrefix, record);
            } else if (record instanceof UserScrolledRepliesEventRecord) {
                this.handleScrolledRepliesRecord(logPrefix, record);
            }
        }

        this.heatmap.draw();

        if (!finished) {
            console.debug(logPrefix + "animation not done yet, requesting another animation frame");
            window.requestAnimationFrame(this.draw);
        }

        console.groupEnd();
    }

    handleMouseClickRecord(logPrefix, record) {
        if (record.event_data.element_id === "" || record.event_data.element_id === undefined || record.event_data.element_id === null) {
            console.debug(logPrefix + "ignoring mouse click event with an empty element id");
            return;
        }

        console.debug(logPrefix + "simulating mouse click on element with id " + record.event_data.element_id);
        $("#" + record.event_data.element_id).click();
    }

    handleHeatmapRecord(logPrefix, record) {
        console.debug(logPrefix + "adding record to heatmap: " + record.toArray(this.props.heatmapYOffset));
        this.heatmap.add(record.toArray(this.props.heatmapYOffset));
    }

    handleScrolledFeedRecord(logPrefix, record) {
        console.debug(logPrefix + "scrolling page to " + record.event_data.offset_x + ", " + record.event_data.offset_y);
        let feedContainer = $("#feedContainer");
        feedContainer.scrollLeft = record.event_data.offset_x;
        feedContainer.scrollTop = record.event_data.offset_y;
    }

    handleScrolledPopupRecord(logPrefix, record) {
        console.debug(logPrefix + "scrolling popup to " + record.event_data.offset_x + ", " + record.event_data.offset_y);
        let modalPostContainer = $(".modal-post-container");
        modalPostContainer.scrollLeft = record.event_data.offset_x;
        modalPostContainer.scrollTop = record.event_data.offset_y;
    }

    handleScrolledRepliesRecord(logPrefix, record) {
        console.debug(logPrefix + " scrolling replies to " + record.event_data.offset_x + ", " + record.event_data.offset_y);
        let replyContainer = $(".modal-replies-container");
        replyContainer.scrollLeft = record.event_data.offset_x;
        replyContainer.scrollTop = record.event_data.offset_y;
    }

    onWindowResized() {
        this.setState({
            canvasWidth: document.body.scrollWidth,
            canvasHeight: document.body.scrollHeight,
        });
    }
}
