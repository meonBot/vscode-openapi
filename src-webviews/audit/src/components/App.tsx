import Footer from "./Footer";
import Header from "./Header";
import Issue from "./Issue";
import Summary from "./Summary";
import { Audit, Issue as IssueType } from "../types";

function issuesById(audit: Audit, ids: number[], uri: string): IssueType[] {
  return ids.map((id) => audit.issues[uri][id]);
}

function allIssues(audit: Audit): IssueType[] {
  const issues = Object.entries(audit.issues)
    .map(([uri, issues]) => {
      return issues;
    })
    .reduce((acc: any, val) => acc.concat(val), []);
  return issues;
}

function App({
  audit,
  kdb,
  ids,
  uri,
}: {
  audit: Audit;
  kdb: any;
  uri: string | null;
  ids: number[] | null;
}) {
  const fullAudit = !(ids !== null && uri !== null);
  const issues = fullAudit ? allIssues(audit) : issuesById(audit, ids, uri);

  return (
    <>
      <Header />
      {fullAudit && <Summary summary={audit.summary} />}
      {issues.map((issue: IssueType) => (
        <Issue kdb={kdb} issue={issue} />
      ))}
      <Footer />
    </>
  );
}

export default App;
