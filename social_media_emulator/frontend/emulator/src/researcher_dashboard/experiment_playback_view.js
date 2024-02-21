import React from "react";
import {AppRoutes} from "./navbar";
import NetworkProgressBar from "../components/network_progress_bar";
import {SocialMediaFeed} from "../social_media_feed";
import {POST_DATA} from "../stimuli/post_data";


export class ExperimentPlaybackView extends React.Component {
    constructor(props) {
        super(props);

        this.initiateDataLoad = this.initiateDataLoad.bind(this);
        this.onDataLoaded = this.onDataLoaded.bind(this);

        this.state = {
            dataLoaded: false,
            data: null,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.testRecord !== null && prevProps.testRecord !== null) {
            if (prevProps.testRecord.id !== this.props.testRecord.id) {
                this.setState({
                    dataLoaded: false,
                    data: null,
                });
            }
        }
    }

    render() {
        if (this.props.currentRoute !== AppRoutes.HEATMAP_VIEW) {
            return "";
        }

        if (this.state.dataLoaded) {
            return (
                <div className={"container-fluid main-dashboard-container"}
                     id={"heatmap-view-container"}>
                    <SocialMediaFeed showHeatmap={this.state.dataLoaded}
                                     heatmapData={this.state.data}
                                     heatmapYOffset={this.props.heatmapYOffset}
                                     testId={this.props.testRecord.id}
                                     serverDriver={this.props.serverDriver}
                                     posts={POST_DATA}/>
                </div>
            );
        } else {
            return (
                <div className={"container-fluid main-dashboard-container"}
                     id={"heatmap-view-container"}>
                    <NetworkProgressBar initiateDataLoad={this.initiateDataLoad}
                                        onDataLoaded={this.onDataLoaded}/>
                </div>
            );
        }
    }

    initiateDataLoad() {
        console.debug("Initiating heatmap record load from server with testID " + this.props.testRecord.id);
        return this.props.serverDriver.getExperimentEventRecords(this.props.testRecord.id);
    }

    onDataLoaded(data) {
        console.debug("Data loaded from server: " + data);
        this.setState({
            dataLoaded: true,
            data: data,
        });
    }
}
