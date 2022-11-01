import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import styled from "styled-components";

import { initStore } from "./store/store";
import { changeTheme, ThemeState } from "@xliic/web-theme";
import ThemeStyles from "@xliic/web-theme/ThemeStyles";

import { showResponse, showError, tryOperation } from "./features/tryit/slice";
import { scanOperation, showScanReport, showScanResponse } from "./features/scan/slice";
import { loadEnv } from "./features/env/slice";
import { loadPrefs } from "./features/prefs/slice";

import { WebAppRequest, HostApplication } from "./types";
import createListener from "./store/listener";
import { useAppSelector } from "./store/hooks";

import ScanOperation from "./components/ScanOperation";
import ScanReport from "./components/ScanReport";
import Env from "./features/env/Env";
import ScanResponse from "./features/scan/Response";
import Response from "./components/response/Response";
import Error from "./components/Error";

import { PageName } from "./features/router/slice";

import "bootstrap/dist/css/bootstrap.min.css";

const requestHandlers: Record<WebAppRequest["command"], Function> = {
  changeTheme,
  scanOperation,
  tryOperation,
  showResponse,
  showScanResponse,
  showError,
  showScanReport,
  loadEnv,
  loadPrefs,
};

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

function App() {
  const theme = useAppSelector((state) => state.theme);
  const { page } = useAppSelector((state) => state.route);

  return (
    <>
      <ThemeStyles theme={theme} />
      <Container>{routes[page]}</Container>
    </>
  );
}

const Container = styled.div``;

function renderWebView(host: HostApplication, theme: ThemeState) {
  const store = initStore(createListener(host), theme);

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );

  window.addEventListener("message", (event) => {
    const { command, payload } = event.data as WebAppRequest;
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
