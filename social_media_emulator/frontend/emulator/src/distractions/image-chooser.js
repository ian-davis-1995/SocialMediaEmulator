import React from "react";
import "../css/distractions/image-chooser.css";


export default class ImageChooser extends React.Component {
    constructor(props) {
        super(props);

        this.onImageSelected = this.onImageSelected.bind(this);

        this.state = {
            selectedImage: null,
        };
    }

    render() {
        let galleryRows = [];

        for (let i=0; i < this.props.images.length; i+=this.props.imagesPerRow) {
            let imageRow = [];

            for (let j=0; j < this.props.imagesPerRow; j++) {
                if (i + j > this.props.images.length) {
                    break;
                }

                let imageSrc = this.props.images[i + j];
                let imageSelected = this.state.selectedImage === imageSrc;
                let isAnyImageSelected = this.state.selectedImage !== null;
                let className;

                if (imageSelected) {
                    className = "image-chooser-cell selected";
                } else if (isAnyImageSelected) {
                    className = "image-chooser-cell not-selected";
                } else {
                    className = "image-chooser-cell";
                }

                imageRow.push(<img src={imageSrc}
                                   className={className}
                                   key={i + j}
                                   onClick={() => {this.onImageSelected(imageSrc);}}/>);
            }

            galleryRows.push(
                <div id={`${this.props.id}-image-row-${i}`} className={"image-chooser-row"}>
                    {imageRow}
                </div>
            );
        }

        return (
          <div id={`${this.props.id}-container`} className={"image-chooser-container"}>
              <div className={"image-chooser-gallery"}>
                {galleryRows}
              </div>

              <p id={`${this.props.id}-prompt`} className={"image-chooser-prompt"}>
                  {this.props.prompt}
              </p>
          </div>
        );
    }

    onImageSelected(imageSrc) {
        if (imageSrc === this.state.selectedImage) {
            this.setState({
                selectedImage: null,
            });
        } else {
            this.setState({
                selectedImage: imageSrc,
            });
        }
    }
}
