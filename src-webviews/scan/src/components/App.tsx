import { HostApplication, Issue } from "../types";

function App({ host, issues }: { host: HostApplication; issues: Issue[] }) {
  const runCurl = (curl: string) => host.postMessage({ command: "curl", curl: curl });
  return (
    <div className="container">
      {issues.map((issue) => (
        <div className="card m-3">
          <div className="card-body">
            <h5 className="card-title">
              {issue.method.toUpperCase()} {issue.path}
            </h5>
            <p>{issue.injectionDescription}</p>
            <p>{issue.responseDescription}</p>
            <pre style={{ cursor: "pointer" }} onClick={() => runCurl(issue.curl)}>
              {issue.curl}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
