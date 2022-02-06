import Article from "./Article";
import { FilesMap, Issue as IssueType } from "../types";
import chevronUp from "./icons/chevron-up.svg";
import chevronDown from "./icons/chevron-down.svg";
import { useState } from "react";

export default function Issue({
  kdb,
  issue,
  goToLine,
  copyIssueId,
}: {
  kdb: any;
  issue: IssueType;
  goToLine: any;
  copyIssueId: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const scoreImpact = issue.displayScore !== "0" ? `Score impact: ${issue.displayScore}` : "";
  const lang =
    issue.filename.toLowerCase().endsWith(".yaml") || issue.filename.toLowerCase().endsWith("yml")
      ? "yaml"
      : "json";
  return (
    <div className="c_roundedbox_section">
      <h1 onClick={toggle} style={{ cursor: "pointer" }}>
        {!isOpen && <img src={chevronDown} style={{ width: 20, height: 20 }} alt="" />}
        {isOpen && <img src={chevronUp} style={{ width: 20, height: 20 }} alt="" />}{" "}
        {issue.description}
      </h1>

      <p>
        <small>
          Issue ID:{" "}
          <span
            className="issue-id"
            onClick={(e) => {
              copyIssueId(issue.id);
            }}
          >
            {issue.id}
          </span>
        </small>
      </p>
      <p>
        <small>
          <a
            className="focus-line"
            href="#"
            onClick={(e) => {
              goToLine(issue.lineNo, issue.pointer);
              e.preventDefault();
            }}
          >
            {issue.filename}:{issue.lineNo}
          </a>
          . Severity: {criticalityNames[issue.criticality]}. {scoreImpact}
        </small>
      </p>

      {isOpen && <Article kdb={kdb} articleId={issue.id} lang={lang} />}
    </div>
  );
}

const criticalityNames = {
  5: "Critical",
  4: "High",
  3: "Medium",
  2: "Low",
  1: "Info",
};
