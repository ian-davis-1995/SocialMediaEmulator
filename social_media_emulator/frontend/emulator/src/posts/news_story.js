import React from "react";

export class NewsPostBody extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            post: props.post,
            modal: props.modal,
            onNewsPostClicked: props.onNewsPostClicked,
        }
    }

    render() {
        let items = [];

        if (this.state.modal) {
            for (let i = 0; i < this.state.post.storySegments.length; i++) {
                let storySegment = this.state.post.storySegments[i];
                items.push(<p className={"story-segment"} id={this.props.id + "-story-segment-" + i}>
                    {storySegment}
                </p>);
            }
        }

        let image;

        if (this.state.post.image !== undefined && this.state.post.image !== null) {
            image = <div className={"post-image-container"} id={this.props.id + "-image-container"}>
                <img src={this.state.post.image}
                     alt={this.state.post.imageAlt} className={"post-image"}
                     id={this.props.id + "-image"}/>
            </div>;
        }

        return (
            <div className={"post-body-container news-story-container"
            + (!this.state.modal ? " news-story-clickable-box" : "")}
                 onClick={() => {
                     if (!this.state.modal) {
                         this.state.onNewsPostClicked();
                     }
                 }}>
                <h1 className={"news-story-headline"} id={this.props.id + "-headline"}>{this.state.post.headline}</h1>
                {image}
                <br/>
                <div className={"post-body-text news-story-body"} id={this.props.id + "-body"}>
                    {!this.state.modal ? this.state.post.storySummary + "..." : ""}
                    {items}
                </div>
            </div>
        );
    }
}
