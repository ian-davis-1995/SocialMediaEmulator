import React from "react";
import { DataTable } from "../components/datatable";
import NetworkProgressBar from "../components/network_progress_bar";


export class ExperimentTestTable extends React.Component {
    constructor(props) {
        super(props);

        this.initiateDataLoad = this.initiateDataLoad.bind(this);
        this.onDataLoaded = this.onDataLoaded.bind(this);
        this.dataTableRef = React.createRef();

        this.state = {
            hasData: false,
            data: null,
            currentPage: 0,
        }
    }

    render() {
        return (
            <div className={"experiment-test-datatable"} id={"experiment-test-datatable"}>
                <NetworkProgressBar
                    initiateDataLoad={this.initiateDataLoad}
                    onDataLoaded={this.onDataLoaded} />
                <DataTable
                    columnNames={["ID", "Timestamp", "Subject ID"]}
                    columns={["id", "iso_timestamp", "subject_id"]}
                    tableData={this.state.data}
                    hasData={this.state.hasData}
                    tableId={"experiment-test-table"}
                    selectStyle={this.props.selectStyle}
                    onRowSelected={this.props.onRowSelected}
                    ref={this.dataTableRef} />
            </div>
        );
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

    getTable() {
        return this.dataTableRef.current;
    }
}