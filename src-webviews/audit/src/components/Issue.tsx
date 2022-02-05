import Article from "./Article";
import { FilesMap, Issue as IssueType } from "../types";
import chevronUp from "./icons/chevron-up.svg";
import chevronDown from "./icons/chevron-down.svg";
import { useState } from "react";

export default function Issue({
  kdb,
  issue,
  filename,
}: {
  kdb: any;
  issue: IssueType;
  filename: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const scoreImpact = issue.displayScore !== "0" ? `Score impact: ${issue.displayScore}` : "";
  const lang =
    filename.toLowerCase().endsWith(".yaml") || filename.toLowerCase().endsWith("yml")
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
          <span className="issue-id" data-issue-id={issue.id}>
            {issue.id}
          </span>
        </small>
      </p>
      <p>
        <small>
          <a
            className="focus-line"
            data-line-no={issue.lineNo}
            data-line-pointer={issue.pointer}
            data-uri="base64"
            href="#"
          >
            {filename}:{issue.lineNo}
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
