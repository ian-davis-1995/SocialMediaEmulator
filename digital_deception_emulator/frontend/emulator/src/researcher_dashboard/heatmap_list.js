import React from "react";
import {AppRoutes} from "./navbar";
import {ExperimentTestTable} from "./experiment_test_datatable";
import {SelectStyle} from "../components/datatable";
import {ExperimentTestRecord} from "../experiment_event";


export default class HeatmapList extends React.Component {
    constructor(props) {
        super(props);

        this.initiateDataLoad = this.initiateDataLoad.bind(this);
        this.onDataLoaded = this.onDataLoaded.bind(this);
        this.onRowSelected = this.onRowSelected.bind(this);

        this.state = {
            hasData: false,
            data: null,
        }
    }

    render() {
        if (this.props.currentRoute !== AppRoutes.HEATMAP_LIST) {
            return "";
        }

        return (
            <div className={"container-fluid main-dashboard-container"} id={"heatmap-list-container"}>
                <ExperimentTestTable tableId={"heatmap-table"}
                                     serverDriver={this.props.serverDriver}
                                     onRowSelected={this.onRowSelected}
                                     selectStyle={SelectStyle.SINGLE}/>
            </div>
        );
    }

    onRowSelected(rowData) {
        this.props.onHeatmapSelected(new ExperimentTestRecord(rowData["timestamp"], rowData["subject_id"], rowData["id"]));
    }

    initiateDataLoad() {
        return this.props.serverDriver.getAllExperimentTests();
    }

    onDataLoaded(data) {
        this.setState({
            hasData: true,
            data: data,
        });
    }
}