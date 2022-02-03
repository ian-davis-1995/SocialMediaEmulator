import React from "react";

import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/css/bootstrap.css";

export const AppRoutes = {
    HOME: "dashboard",
    EXPORT: "export",
    HEATMAP_LIST: "heatmap_list",
    HEATMAP_VIEW: "heatmap_view",
}

export function Navbar(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="navbar-brand" onClick={props.onExportClicked}>Dashboard</button>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className={(props.currentRoute === AppRoutes.EXPORT || props.currentRoute === AppRoutes.HOME)
                        ? "nav-item active" : "nav-item"}>
                        <button className="nav-link" onClick={props.onExportClicked}>Export</button>
                    </li>
                    {/* <li className={props.currentRoute === AppRoutes.HEATMAP_LIST || props.currentRoute === AppRoutes.HEATMAP_VIEW ? "nav-item active" : "nav-item"}>
                        <button className="nav-link" onClick={props.onHeatmapsClicked}>Heatmaps</button>
                    </li> */}
                    {/* <HeatmapDetails currentRoute={props.currentRoute}
                        heatmapTestRecord={props.heatmapTestRecord} /> */}
                </ul>
            </div>
        </nav>
    );
}

function HeatmapDetails(props) {
    if (props.currentRoute === AppRoutes.HEATMAP_VIEW) {
        return (
            <div className={"heatmap-details-container"}>
                <div className={"vertical-line"} />
                <p className={"heatmap-details-piece nav-link active"}>
                    Subject ID: {props.heatmapTestRecord.subject_id}
                </p>
                <p className={"heatmap-details-piece nav-link active"}>
                    Test Timestamp: {props.heatmapTestRecord.iso_timestamp}
                </p>
            </div>
        )
    } else {
        return "";
    }
}