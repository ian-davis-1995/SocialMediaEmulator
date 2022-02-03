import React from "react";
import "../css/distractions/single-image-view.css";

export default class SingleImageView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const imageStyle = {
            maxWidth: `${this.props.imageWidth}px`,
            maxHeight: `${this.props.imageHeight}px`,
        }
        console.debug(this.props.imageWidth);
        console.debug("Image style for single image view");
        console.debug(imageStyle);
        return (
          <div id={`${this.props.id}-container`} className={"single-image-view-container"}>
              <img src={this.props.image}
                   className={"single-image-view-cell"}
                   id={`${this.props.id}-image-view`}
                   style={imageStyle}/>
              <p id={`${this.props.id}-prompt`} className={"single-image-view-prompt"}>
                  {this.props.prompt}
              </p>
          </div>
        );
    }
}