import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { WebappRequest, WebappResponse, WebappHost } from "@xliic/common/webapp/scan";

import { initStore, createListener } from "./store";
import ThemeStyles from "../../features/theme/ThemeStyles";
import { ThemeState, changeTheme } from "../../features/theme/slice";

import { showResponse, showError } from "../tryit/slice";
import { scanOperation, showScanReport, showScanResponse } from "./slice";
import { loadEnv } from "../../features/env/slice";
import { loadPrefs } from "../../features/prefs/slice";

import { useAppSelector } from "./store";

import ScanOperation from "./ScanOperation";
import ScanReport from "./ScanReport";
import Env from "../../features/env/Env";
import ScanResponse from "./Response";
import Response from "../tryit/Response";
import Error from "../tryit/Error";

import { PageName } from "./router";

import "bootstrap/dist/css/bootstrap.min.css";

const routes: Record<PageName, JSX.Element> = {
  scanOperation: <ScanOperation />,
  tryOperation: <div>nope</div>,
  scanReport: <ScanReport />,
  scanResponse: <ScanResponse />,
  response: <Response />,
  error: <Error />,
  env: <Env />,
  loading: <div>Loading...</div>,
};

const requestHandlers: Record<WebappRequest["command"], Function> = {
  changeTheme,
  scanOperation,
  showScanResponse,
  showError,
  showScanReport,
  loadEnv,
  loadPrefs,
};

function App() {
  const { page } = useAppSelector((state) => state.route);
  return (
    <>
      <ThemeStyles />
      <div>{routes[page]}</div>
    </>
  );
}

function renderWebView(host: WebappHost, theme: ThemeState) {
  const store = initStore(createListener(host), theme);

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );

  window.addEventListener("message", (event) => {
    const { command, payload } = event.data as WebappRequest;
    if (command) {
      const handler = requestHandlers[command];
      if (handler) {
        store.dispatch(handler(payload));
      } else {
        console.error(`Unable to find handler for command: ${command}`);
      }
    } else {
      console.error("Received message with unknown command", event.data);
    }
  });
}

(window as any).renderWebView = renderWebView;
