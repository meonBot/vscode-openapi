import Header from "./Header";
import Summary from "./Summary";
import Footer from "./Footer";
import Issue from "./Issue";
import { useAppSelector } from "../hooks";

function App() {
  const kdb = useAppSelector((state) => state.kdb);
  const fullReport = useAppSelector((state) => state.report.full);
  const issues = useAppSelector((state) => state.report.selected);

  return (
    <>
      <Header />
      {fullReport && <Summary />}
      {issues.map((issue) => (
        <Issue kdb={kdb} issue={issue} filename="foo.json" key={issue.key} />
      ))}
      <Footer />
    </>
  );
}

export default App;
