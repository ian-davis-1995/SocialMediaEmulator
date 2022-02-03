import React from "react";
import $ from "jquery";

import "datatables.net";
import "datatables.net-dt";
import "datatables.net-dt/css/jquery.dataTables.css";

import "datatables.net-select";
import "datatables.net-select-dt";
import "datatables.net-select-dt/css/select.dataTables.css";

import "datatables.net-fixedheader";
import "datatables.net-fixedheader-dt";
import "datatables.net-fixedheader-dt/css/fixedHeader.dataTables.css";


export const SelectStyle = {
    SINGLE: "single",
    MULTI: "multi",
    OS: "os",
    MULTISHIFT: "multi+shift",
}


export class DataTable extends React.Component {
    constructor(props) {
        super(props);

        this.setupDataTable = this.setupDataTable.bind(this);
        this.getDataTableConfig = this.getDataTableConfig.bind(this);

        this.dataTableRef = React.createRef();
        this.dataTableInstance = null;
    }

    componentDidMount() {
        this.setupDataTable();
        window.addEventListener("resize", this.setupDataTable);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.setupDataTable);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setupDataTable();

        if (this.props.onRowSelected !== undefined && this.props.onRowSelected !== null) {
            $("tbody > tr").click((event) => {
                if (this.dataTableInstance === null) {
                    return;
                }

                let rowData = this.dataTableInstance.row(event.target).data();
                this.props.onRowSelected(rowData);
            });
        }
    }

    render() {
        if (!this.props.hasData) {
            return "";
        }

        let columns = [];

        for (let i = 0; i < this.props.columnNames.length; i++) {
            columns.push(<td key={i}>{this.props.columnNames[i]}</td>);
        }

        return (
            <table id={this.props.tableId}
                className={"display"}
                style={{ width: "100%" }} ref={this.dataTableRef}>
                <thead>
                    <tr className={"data-table-header"}>
                        {columns}
                    </tr>
                </thead>
            </table>
        );
    }

    setupDataTable() {
        if (this.dataTableInstance !== null) {
            this.dataTableInstance.destroy();
        }

        console.debug("[DATATABLE][SETUP] - Setting up the DataTable");
        this.dataTableInstance = $("#" + this.props.tableId).DataTable(this.getDataTableConfig());
    }

    getDataTableConfig() {
        let height = window.screen.height;
        let vh = height * .75;
        let scrollY = vh + "px";
        let columnDicts = [];

        for (let i = 0; i < this.props.columns.length; i++) {
            let columnName = this.props.columns[i];
            columnDicts.push({ data: columnName });
        }

        let selectStyle = this.props.selectStyle;

        if (selectStyle === undefined || selectStyle === null) {
            selectStyle = SelectStyle.MULTISHIFT;
        }

        return {
            select: {
                style: selectStyle,
            },
            data: this.props.tableData,
            columns: columnDicts,
            paging: false,
            scrollY: scrollY,
            scrollCollapse: true,
            scrollX: true,
            autoWidth: true,
            deferRender: true,
        };
    }

    selectAllRows() {
        if (this.dataTableInstance == null) return;
        this.dataTableInstance.rows().select();
    }

    getSelectedRows() {
        if (this.dataTableInstance === null) return null;
        return this.dataTableInstance.rows({ selected: true }).data();
    }
}