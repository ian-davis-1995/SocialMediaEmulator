import React from "react";
import { render } from "react-dom";

import "./css/theme.css";
import "./css/root.css";
import "./css/navbar.css";
import "./css/dashboard.css";

import { AppRoutes, Navbar } from "./researcher_dashboard/navbar";
import ExportPage from "./researcher_dashboard/export";
import HeatmapList from "./researcher_dashboard/heatmap_list";
import { DigitalDeceptionDriver, DummyDigitalDeceptionDriver } from "./network";
import { ExperimentPlaybackView } from "./researcher_dashboard/experiment_playback_view";


class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.onExportClicked = this.onExportClicked.bind(this);
        this.onHeatmapsClicked = this.onHeatmapsClicked.bind(this);
        this.onHeatmapSelected = this.onHeatmapSelected.bind(this);

        this.state = {
            currentRoute: AppRoutes.HOME,
            heatmapTestRecord: null,
        };
    }

    render() {
        return (
            <div className={"container-fluid"} id={"dashboard-container"}>
                <Navbar onExportClicked={this.onExportClicked}
                    onHeatmapsClicked={this.onHeatmapsClicked}
                    currentRoute={this.state.currentRoute}
                    heatmapTestRecord={this.state.heatmapTestRecord} />
                <ExportPage currentRoute={this.state.currentRoute}
                    serverDriver={this.props.serverDriver} />
                {/* <HeatmapList currentRoute={this.state.currentRoute}
                             serverDriver={this.props.serverDriver}
                             onHeatmapSelected={this.onHeatmapSelected}/> */}
                {/* <ExperimentPlaybackView currentRoute={this.state.currentRoute}
                                        serverDriver={this.props.serverDriver}
                                        testRecord={this.state.heatmapTestRecord}
                                        heatmapYOffset={50}/> */}
            </div>
        );
    }

    onExportClicked() {
        this.setState({
            currentRoute: AppRoutes.EXPORT,
        });
    }

    onHeatmapsClicked() {
        this.setState({
            currentRoute: AppRoutes.HEATMAP_LIST,
        });
    }

    onHeatmapSelected(testRecord) {
        this.setState({
            currentRoute: AppRoutes.HEATMAP_VIEW,
            heatmapTestRecord: testRecord,
        });
    }
}


let serverDriver = new DigitalDeceptionDriver();

if (process.env.NODE_ENV !== "production" && !window.serverRunning) {
    console.debug("[STARTUP][experiment.js] - Enabling dummy server driver as we are in debug mode");
    serverDriver = new DummyDigitalDeceptionDriver();
}


render(<Dashboard serverDriver={serverDriver} />, document.getElementById("root"));
