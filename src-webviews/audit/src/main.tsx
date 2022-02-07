import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { initStore } from "./store";

import { showFullReport, showPartialReport, showNoReport } from "./reportSlice";

import App from "./components/App";

import "./bootstrap.min.css";
import "./style.css";
import { KdbState } from "./kdbSlice";
import { HostApplication } from "./types";

function renderAuditReport(host: HostApplication, kdb: KdbState) {
  const store = initStore(host, kdb);
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
      case "showFullReport":
        window.scrollTo(0, 0);
        store.dispatch(showFullReport(message.report));
        break;
      case "showPartialReport":
        window.scrollTo(0, 0);
        store.dispatch(
          showPartialReport({ report: message.report, ids: message.ids, uri: message.uri })
        );
        break;
      case "showNoReport":
        window.scrollTo(0, 0);
        store.dispatch(showNoReport());
        break;
    }
  });
}

(window as any).renderAuditReport = renderAuditReport;
