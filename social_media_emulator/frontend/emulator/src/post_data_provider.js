import React from "react";
import { SocialMediaFeed } from "./social_media_feed";
import $ from "jquery";

import "./css/root.css";
import "./css/theme.css";
import "./css/post_data_provider.css";
import { POST_DATA } from "./stimuli/post_data";


export class PostDataProvider extends React.Component {
    constructor(props) {
        super(props);

        this.onRenderClicked = this.onRenderClicked.bind(this);

        this.state = {
            viewingFeed: true,
        };
    }

    render() {
        if (this.state.viewingFeed) {
            return (
                <SocialMediaFeed
                    showHeatmap={this.props.showHeatmap}
                    heatmapData={this.props.heatmapData}
                    testId={this.props.testId}
                    heatmapYOffset={0}
                    serverDriver={this.props.serverDriver}
                    posts={this.props.posts}
                    practiceMode={this.props.practiceMode}
                    requiredResponsePosts={this.props.requiredResponsePosts}
                    onUserDismissedValidation={this.props.onUserDismissedValidation}
                    onAllCriteriaMet={this.props.onAllCriteriaMet}
                    onRequiredCriteriaMet={this.props.onRequiredCriteriaMet} />
            );
        } else {
            return (
                <div id={"post-data-provider"}>
                    <h1 id={"post-data-provider-title"}>Insert JSON Formatted Post Data here to render the social media feed</h1>
                    <textarea id={"post-data-textarea"} />
                    <button id={"post-data-render"} className={"button"} onClick={this.onRenderClicked}>Render</button>
                </div>
            );
        }
    }

    onRenderClicked() {
        let postDataText = $("#post-data-textarea").val();
        let postData;

        if (postDataText === "") {
            postData = POST_DATA;
        } else {
            postData = JSON.parse(postDataText);
        }

        this.setState({
            viewingFeed: true,
            postData: postData,
        });
    }
}