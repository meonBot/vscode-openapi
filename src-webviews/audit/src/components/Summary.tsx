import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useState } from "react";

export default function Summary() {
  const summary = useSelector((state: RootState) => state.report.summary);

  return (
    <div className="c_roundedbox">
      <h1>
        Security audit score: <span>{summary.all}&nbsp;/&nbsp;100</span>
      </h1>
      <div className="progress-bar-holder">
        <div className="progress-bar bar-red" style={{ width: summary.all }}></div>
      </div>
      <h3>
        Security:{" "}
        <span>
          {summary.security.value} / {summary.security.max}
        </span>
      </h3>
      <h3>
        Data validation:{" "}
        <span>
          {summary.datavalidation.value} / {summary.datavalidation.max}
        </span>
      </h3>
      <div>
        <small>
          Please submit your feedback for the security audit{" "}
          <a
            href="https://github.com/42Crunch/vscode-openapi/issues"
            title="https://github.com/42Crunch/vscode-openapi/issues"
          >
            here
          </a>
        </small>
      </div>
    </div>
  );
}
