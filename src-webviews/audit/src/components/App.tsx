import Header from "./Header";
import Summary from "./Summary";
import Footer from "./Footer";
import Issue from "./Issue";
import GoToFullReport from "./GoToFullReport";
import NoReport from "./NoReport";

import { useAppSelector, useAppDispatch } from "../hooks";
import { goToLine, copyIssueId } from "../hostActions";

function App() {
  const kdb = useAppSelector((state) => state.kdb);
  const display = useAppSelector((state) => state.report.display);
  const issues = useAppSelector((state) => state.report.selected);
  const dispatch = useAppDispatch();
  const hostGoToLine = (line: number, pointer: string) => dispatch(goToLine({ line, pointer }));
  const hostCopyIssueId = (id: string) => dispatch(copyIssueId(id));

  return (
    <>
      <Header />
      {display === "full" && <Summary />}
      {display === "no-report" && <NoReport />}
      {issues.map((issue) => (
        <Issue
          kdb={kdb}
          issue={issue}
          key={issue.key}
          goToLine={hostGoToLine}
          copyIssueId={hostCopyIssueId}
        />
      ))}
      {display === "partial" && <GoToFullReport />}
      <Footer />
    </>
  );
}

export default App;
