import React from "react";
import ReactDOM from "react-dom";
import "./bootstrap.min.css";
import App from "./components/App";
import "./style.css";
import { Issue } from "./types";

function getIssues(report: any): Issue[] {
  const results: Issue[] = [];
  for (const [path, operations] of Object.entries(report.paths)) {
    for (const [method, result] of Object.entries(operations as any)) {
      console.log("go me", method, result);
      if ((result as any).issues) {
        for (const issue of (result as any).issues) {
          results.push({
            path,
            method,
            injectionDescription: issue.injectionDescription,
            responseDescription: issue.apiResponseAnalysis[0].responseDescription,
            curl: issue.curl,
          });
          console.log("go is", issue);
        }
      }
    }
    console.log("go pa", path);
  }
  return results;
}

function renderScanReport(report: any) {
  const issues = getIssues(report);
  console.log("issues", issues);
  ReactDOM.render(
    <React.StrictMode>
      <App issues={issues} />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

(window as any).renderScanReport = renderScanReport;
