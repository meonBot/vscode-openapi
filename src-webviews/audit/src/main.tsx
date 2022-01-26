import React from "react";
import ReactDOM from "react-dom";
import "./bootstrap.min.css";
import "./style.css";
import App from "./components/App";

function renderAuditReport(kdb: any, audit: any, uri: string | null, ids: number[] | null) {
  ReactDOM.render(
    <React.StrictMode>
      <App kdb={kdb} audit={audit} ids={ids} uri={uri} />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

(window as any).renderAuditReport = renderAuditReport;
