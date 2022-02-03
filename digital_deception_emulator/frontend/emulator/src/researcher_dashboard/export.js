import React from "react";
import { AppRoutes } from "./navbar";
import { ExperimentTestTable } from "./experiment_test_datatable";
import { SelectStyle } from "../components/datatable";

import "../css/export.css";

const autoBind = require("auto-bind");

export default class ExportPage extends React.Component {
    constructor(props) {
        super(props);

        autoBind(this);

        this.exportTableRef = React.createRef();

        this.state = {
            hasData: false,
            data: null,
        }
    }

    render() {
        if (this.props.currentRoute !== AppRoutes.EXPORT &&
            this.props.currentRoute !== AppRoutes.HOME) {
            return "";
        }

        return (
            <div className={"container-fluid main-dashboard-container"} id={"export-container"}>
                <ExperimentTestTable
                    tableId={"export-table"}
                    serverDriver={this.props.serverDriver}
                    selectStyle={SelectStyle.OS}
                    ref={this.exportTableRef} />
                <div className={"export-toolbar"}>
                    <button
                        className={"button export-button"}
                        onClick={this.onExportClicked}>
                        <span className={"material-icons"}>file_download</span>
                    </button>
                </div>
            </div>
        );
    }

    onSelectAllClicked() {
        if (this.exportTableRef === null) return
        if (this.exportTableRef.current === null) return
        if (this.exportTableRef.current.getTable() === null) return

        this.exportTableRef.current.getTable().selectAllRows();
    }

    onExportClicked() {
        if (this.exportTableRef === null) return
        if (this.exportTableRef.current === null) return
        if (this.exportTableRef.current.getTable() === null) return

        let selectedData = this.exportTableRef.current.getTable().getSelectedRows();
        let subjectIds = [];

        for (let i = 0; i < selectedData.length; i++) {
            let testRecord = selectedData[i];
            subjectIds.push(testRecord.subject_id);
        }

        let subjectIdString = subjectIds.join(",");

        console.debug("Exporting test data gathered from selected rows: ");
        console.debug(selectedData);
        console.debug(subjectIdString);
        window.location = "api/export?subject_ids=" + subjectIds;
    }
}
