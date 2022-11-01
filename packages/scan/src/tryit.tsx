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
import { PageName } from "./features/router/slice";
import { useAppSelector } from "./store/hooks";

import TryOperation from "./components/TryOperation";
import Response from "./components/response/Response";
import Error from "./components/Error";

import { WebAppRequest, HostApplication } from "./types";
import createListener from "./store/listener";

import "bootstrap/dist/css/bootstrap.min.css";

const routes: Record<PageName, JSX.Element> = {
  tryOperation: <TryOperation />,
  response: <Response />,
  error: <Error />,
  loading: <div>Loading...</div>,
  scanOperation: <div>nope</div>,
  scanReport: <div>nope</div>,
  scanResponse: <div>nope</div>,
  env: <div>nope</div>,
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
