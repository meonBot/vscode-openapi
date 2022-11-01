import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { WebappRequest, WebappResponse, WebappHost } from "@xliic/common/webapp/tryit";

import { initStore, createListener } from "./store";
import { changeTheme, ThemeState } from "@xliic/web-theme";
import ThemeStyles from "@xliic/web-theme/ThemeStyles";

import { showResponse, showError, tryOperation } from "../../features/tryit/slice";
import { loadEnv } from "../../features/env/slice";
import { loadPrefs } from "../../features/prefs/slice";

import { useAppSelector } from "./store";

import TryOperation from "../../components/TryOperation";
import Response from "../../components/response/Response";
import Error from "../../components/Error";

import { PageName } from "./router";

import "bootstrap/dist/css/bootstrap.min.css";

const routes: Record<PageName, JSX.Element> = {
  tryOperation: <TryOperation />,
  response: <Response />,
  error: <Error />,
  loading: <div>Loading...</div>,
};

const requestHandlers: Record<WebappRequest["command"], Function> = {
  changeTheme,
  tryOperation,
  showResponse,
  showError,
  loadEnv,
  loadPrefs,
};

function App() {
  const theme = useAppSelector((state) => state.theme);
  const { page } = useAppSelector((state) => state.route);
  return (
    <>
      <ThemeStyles theme={theme} />
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
