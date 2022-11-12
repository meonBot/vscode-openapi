import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { Webapp } from "@xliic/common/webapp/scan";

import { initStore, createListener } from "./store";
import ThemeStyles from "../../features/theme/ThemeStyles";
import { ThemeState, changeTheme } from "../../features/theme/slice";
import Router from "../../features/router/Router";
import { RouterContext, Routes } from "../../features/router/RouterContext";
import Navigation from "../../features/router/Navigation";

import { scanOperation, showScanReport, showScanResponse, showError } from "./slice";
import { loadEnv } from "../../features/env/slice";
import { loadPrefs } from "../../features/prefs/slice";

import ScanOperation from "./ScanOperation";
import ScanReport from "./ScanReport";
import Env from "../../features/env/Env";
import ScanResponse from "./Response";
import Error from "./Error";

import "bootstrap/dist/css/bootstrap.min.css";

const routes: Routes = [
  {
    id: "scan",
    title: "Scan",
    element: <ScanOperation />,
    when: scanOperation,
  },
  {
    id: "report",
    title: "Report",
    element: <ScanReport />,
    when: showScanReport,
    children: [
      { id: "response", title: "Response", element: <ScanResponse />, when: showScanResponse },
      { id: "error", title: "Error", element: <Error />, when: showError },
    ],
  },
  { id: "env", title: "Environment", element: <Env /> },
];

const requestHandlers: Webapp["requestHandler"] = {
  changeTheme,
  scanOperation,
  showScanResponse,
  showError,
  showScanReport,
  loadEnv,
  loadPrefs,
};

function App() {
  return (
    <>
      <ThemeStyles />
      <Navigation />
      <Router />
    </>
  );
}

function renderWebView(host: Webapp["host"], theme: ThemeState) {
  const store = initStore(createListener(host, routes), theme);

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterContext.Provider value={routes}>
          <App />
        </RouterContext.Provider>
      </Provider>
    </React.StrictMode>
  );

  window.addEventListener("message", (event) => {
    const { command, payload } = event.data as Webapp["request"];
    if (command) {
      const handler = requestHandlers[command];
      if (handler) {
        store.dispatch(handler(payload as any));
      } else {
        console.error(`Unable to find handler for command: ${command}`);
      }
    } else {
      console.error("Received message with unknown command", event.data);
    }
  });
}

(window as any).renderWebView = renderWebView;
