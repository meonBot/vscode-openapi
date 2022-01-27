import { Issue } from "../types";

function App({ issues }: { issues: Issue[] }) {
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
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
