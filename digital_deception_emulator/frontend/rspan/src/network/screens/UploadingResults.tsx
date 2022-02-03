import React from "react";
import ProgressBar from "progressbar.js";

import '../../css/uploading_results_screen.css';


export default class UploadingResultsScreen extends React.Component {
    readonly progressBar = React.createRef<HTMLDivElement>();

    componentDidMount() {
        const bar = new ProgressBar.Circle(this.progressBar.current, {
            strokeWidth: 6,
            easing: 'easeInOut',
            duration: 2000,
            color: '#ABABAB',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: null
        });

        let currentStep = 1.0;

        function animate() {
            bar.animate(currentStep, {}, function () {
                currentStep++;
                animate();
            });
        }

        animate();
    }

    render() {
        return <div className="uploading-results-container">
            <p className="uploading-results-body">
                Uploading experiment results, please wait...
            </p>
            <div className="uploading-results-progress-bar" id="progress-bar-container" ref={this.progressBar} />
        </div>
    }
}