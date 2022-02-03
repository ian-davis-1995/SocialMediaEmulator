import React from "react";
import {RadialProgress} from "./radialprogress";

export default class NetworkProgressBar extends React.Component {
    constructor(props) {
        super(props);

        this.progressBarRef = React.createRef();
        this.progressBar = null;

        this.state = {
            data: null,
            dataLoaded: false,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.dataLoaded && !prevState.dataLoaded) {
            this.props.onDataLoaded(this.state.data);
        }
    }

    componentDidMount() {
        this.props.initiateDataLoad().then((data) => {
           this.setState({
               data: data,
              dataLoaded: true,
           });
        });

        this.progressBar = new RadialProgress(this.progressBarRef.current, {
            indeterminate: true,
        });
    }

    render() {
        if (this.state.dataLoaded) {
            return "";
        }

        return (<div className={"network-progress-bar"} ref={this.progressBarRef}/>);
    }
}