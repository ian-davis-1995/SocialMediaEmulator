import React from "react";
import $ from "jquery";

import "jquery-ui/themes/base/core.css";
import "jquery-ui/themes/base/theme.css";
import "jquery-ui/themes/base/slider.css";
import "jquery-ui/ui/widgets/slider";

import "../lib/jquery-ui-touch-punch";

import "../css/distractions/two-similar-pictures.css";


function degreesToRadians(angle) {
    return angle * 0.01745;
}


export default class TwoSimilarPictures extends React.Component {
    constructor(props) {
        super(props);

        this.slider = React.createRef();
        this.imageOne = React.createRef();
        this.imageTwo = React.createRef();
        this.canvasOne = React.createRef();
        this.canvasTwo = React.createRef();

        this.onSliderChanged = this.onSliderChanged.bind(this);
        this.updateCanvases = this.updateCanvases.bind(this);

        this.state = {
            imageOneLoaded: false,
            imageTwoLoaded: false,
            currentAngle: 0,
        }
    }

    componentDidMount() {
        let component = this;

        this.imageOne.current.onload = function() {
            console.debug("Image one loaded");
            component.setState({
                imageOneLoaded: true
            });
        }

        this.imageOne.current.onerror = function() {
            console.debug("Error loading image one");
        }

        this.imageTwo.current.onload = function() {
            console.debug("Image two loaded");
            component.setState({
                imageTwoLoaded: true
            });
        }

        this.imageTwo.current.onerror = function() {
            console.debug("Error loading image two");
        }

        $(`#${this.props.id}-slider`).slider({
            min: 0,
            max: 180,
            step: 1,
            slide: this.onSliderChanged
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.imageOneLoaded && this.state.imageTwoLoaded) {
            console.debug(`two-similar-pictures - componentDidUpdate - updateCanvases(${this.state.currentAngle})`);
            this.updateCanvases(this.state.currentAngle);
        }
    }

    render() {
        return (
            <div className={"two-similar-pictures-top-container"}>
                <div id={this.props.id} className={"two-similar-pictures-container"}>
                    <canvas id={`${this.props.id}-image-one-canvas`}
                            ref={this.canvasOne}
                            className={"two-similar-pictures-canvas"}/>
                    <canvas id={`${this.props.id}-image-two-canvas`}
                            ref={this.canvasTwo}
                            className={"two-similar-pictures-canvas"}/>

                    <img id={`${this.props.id}-image-one`}
                         src={this.props.imageOne}
                         hidden={true}
                         ref={this.imageOne}/>
                    <img id={`${this.props.id}-image-two`}
                         src={this.props.imageTwo}
                         hidden={true}
                         ref={this.imageTwo}/>
                </div>

                <div id={`${this.props.id}-slider`}
                     ref={this.slider}
                     hidden={!this.state.imageOneLoaded || !this.state.imageTwoLoaded}
                     className={"two-similar-pictures-slider"}/>
                <p className={"two-similar-pictures-description"}>
                    {this.props.description}
                </p>
            </div>
        );
    }

    onSliderChanged(event, ui) {
        this.updateCanvases(ui.value);
        this.setState({
            currentAngle: ui.value,
        });
    }

    updateCanvases(angle) {
        console.log(`two-similar-pictures -- Canvas updated -- redrawing -- angle = ${angle}`);
        let contextOne = this.canvasOne.current.getContext('2d');
        let contextTwo = this.canvasTwo.current.getContext('2d');

        this.drawCanvas(contextOne, angle, this.imageOne.current, this.canvasOne.current);
        this.drawCanvas(contextTwo, angle, this.imageTwo.current, this.canvasTwo.current);
    }

    drawCanvas(context, angle, image, canvas) {
        context.save();

        let imageWidth = image.width;
        let imageHeight = image.height;

        if (imageWidth > canvas.width) {
            canvas.height = imageHeight * canvas.width / imageWidth;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.translate(canvas.width * .5, canvas.height * .5);
        context.rotate(degreesToRadians(angle));
        context.translate(-canvas.width * .5, -canvas.height * .5);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        context.restore();
    }
}
