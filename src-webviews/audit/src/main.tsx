import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { initStore } from "./store";

import { show, showIds } from "./reportSlice";

import App from "./components/App";

import "./bootstrap.min.css";
import "./style.css";
import { KdbState } from "./kdbSlice";

function renderAuditReport(kdb: KdbState) {
  const store = initStore(kdb);
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );

  window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.command) {
      case "show":
        console.log("got show command");
        store.dispatch(show(message.report));
        break;
      case "showIds":
        store.dispatch(showIds({ report: message.report, ids: message.ids, uri: message.uri }));
        break;
    }
  });
}

(window as any).renderAuditReport = renderAuditReport;
