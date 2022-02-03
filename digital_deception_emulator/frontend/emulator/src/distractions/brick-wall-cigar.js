import React from "react";
import $ from "jquery";
import "jquery-ui/themes/base/core.css";
import "jquery-ui/themes/base/theme.css";
import "jquery-ui/themes/base/slider.css";
import "jquery-ui/themes/base/progressbar.css";
import "jquery-ui/ui/widgets/slider";
import "jquery-ui/ui/widgets/progressbar";

import "../lib/jquery-ui-touch-punch";

import "../css/distractions/brick-wall-cigar.css";

import wall from "../assets/distractions/cigar-wall/wall.jpg";
import mask from "../assets/distractions/cigar-wall/mask.png";

export default class BrickWallCigar extends React.Component {
    constructor(props) {
        super(props);

        this.slider = React.createRef();
        this.progressBar = React.createRef();
        this.canvas = React.createRef();

        this.wallImage = React.createRef();
        this.maskImage = React.createRef();

        this.onSliderChanged = this.onSliderChanged.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);

        this.state = {
            wallImageLoaded: false,
            maskImageLoaded: false,
        };
    }

    componentDidMount() {
        let component = this;

        this.wallImage.current.onload = function() {
          component.setState({
              wallImageLoaded: true,
          });
        };

        this.wallImage.current.onerror = function() {
            console.debug("Error loading wall image");
        }

        this.maskImage.current.onload = function() {
            component.setState({
               maskImageLoaded: true,
            });
        }

        this.maskImage.current.onerror = function() {
            console.debug("Error loading mask image");
        }

        $("#slider").slider({
            min: 0,
            max: 1,
            step: 0.01,
            slide: this.onSliderChanged
        });

        $("#progress-bar").progressbar({
            value: false,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.wallImageLoaded && this.state.maskImageLoaded) {
            this.updateCanvas(0);
        }
    }

    render() {
        return (
            <div id={"brick-wall-cigar-container"}>
                <h1 id={"brick-wall-title"}>This looks like an ordinary brick wall</h1>
                <h2 id={"brick-wall-subtitle"}>Do you see anything out of the ordinary?</h2>
                <canvas id="brick-wall-canvas" ref={this.canvas}>
                    Your browser does not support the HTML5 canvas tag.
                </canvas>

                <div id="slider" ref={this.slider} hidden={!this.state.wallImageLoaded || !this.state.maskImageLoaded}/>

                <p className={"brick-wall-paragraph"}>
                    It might "burn" you up until you find it!
                    </p>
                <p className={"brick-wall-paragraph"}>
                    Drag the slider above to shed some light on the matter.
                </p>

                <img src={wall} hidden={true} ref={this.wallImage}/>
                <img src={mask} hidden={true} ref={this.maskImage}/>
            </div>
        );
    }

    updateCanvas(opacity) {
        if (!this.state.wallImageLoaded || !this.state.maskImageLoaded) {
            console.debug("Images aren't loaded yet, waiting");
            return;
        }

        console.debug(opacity);

        let context = this.canvas.current.getContext("2d");
        context.globalAlpha = 1;

        console.debug("maskImage width: " + this.maskImage.current.width);
        console.debug("maskImage height: " + this.maskImage.current.height);
        console.debug("canvas width: " + this.canvas.current.width);
        console.debug("canvas height: " + this.canvas.current.height);

        let sourceWidth = this.maskImage.current.width;
        let sourceHeight = this.maskImage.current.height;
        let destWidth = this.canvas.current.width;
        let destHeight = this.canvas.current.height;

        if (this.canvas.current.width < 235) {
            // TODO: Handle canvas too small to show at least the cigar portion.
            return;
        }

        if (sourceWidth > this.canvas.current.width) {
            // x / y = sourceWidth / sourceHeight;
            // Adjust the canvas height to maintain the proper aspect ratio of the image after scaling.
            destWidth = this.canvas.current.width = destWidth;
            destHeight = this.canvas.current.height = sourceHeight * destWidth / sourceWidth;
        }

        context.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
        context.drawImage(this.maskImage.current, 0, 0, destWidth, destHeight);

        // Draw the wall at the opacity specified by the slider.
        context.globalCompositeOperation = "source-in"; // Draw only where we don't overlap the existing canvas data. This draw the wall at the requested opacity.
        context.globalAlpha = opacity;
        context.drawImage(this.wallImage.current, 0, 0, destWidth, destHeight);
        context.globalAlpha = 1;

        // Draw the cigar at full opacity.
        context.globalCompositeOperation = "source-out"; // Draw overlapping the existing canvas data. This draws the cigar at full opacity.
        context.drawImage(this.wallImage.current, 0, 0, destWidth, destHeight);
        context.restore();
    }

    onSliderChanged(event, ui) {
        this.updateCanvas(ui.value);
    }
}

// render(<BrickWallCigar wallImage={"/digital-deception/assets/distractions/wall.jpg"}
//                        maskImage={"/digital-deception/assets/distractions/mask.png"}/>, document.getElementById("root"));
