import React from "react";
import "../css/author_bar.css";

const autoBind = require("auto-bind");

export default class AuthorBar extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    render() {
        let profilePicture;

        if (props.post.profilePicture !== undefined && props.post.profilePicture !== null) {
            profilePicture = <div className={"profile-picture-container"}>
                <img src={props.post.profilePicture}
                    className={"profile-picture"} alt={"User Profile"} id={props.id + "-profile-picture"} />
            </div>;
        }

        return <div className={"author-bar-container"} id={props.id + "-title"}>
            {profilePicture}
            <div className={"author-bar-name"} id={props.id + "-author"}>
                {props.post.author}
            </div>
            <div className={"author-bar-date"} id={props.id + "-post-date"}>
                {props.post.postDate}
            </div>
        </div>
    }
}
