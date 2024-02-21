import React from "react";
import "../css/story_button.css";

export default class StoryButton extends React.Component {
    render() {
        return <button className={"story-button-container"}
            id={`${this.props.id}-feed-button`}
            onClick={this.props.onStoryClicked}
            disabled={this.props.disabled}>
            <p className={"story-title"}>
                {this.props.storyTitle}
            </p>
            <p id={`${this.props.id}-story-click-text`} className={"story-click-indicator"}>
                Click to read the excerpt
            </p>
        </button>
    }
}
