import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { Webapp } from "@xliic/common/webapp/tryit";

import { initStore, createListener } from "./store";
import ThemeStyles from "../../features/theme/ThemeStyles";
import { ThemeState, changeTheme } from "../../features/theme/slice";

import { showResponse, showError, tryOperation } from "./slice";
import { loadEnv } from "../../features/env/slice";
import { loadPrefs } from "../../features/prefs/slice";

import { useAppSelector } from "./store";

import TryOperation from "./TryOperation";
import Response from "./Response";
import Error from "./Error";

import { PageName } from "./router";

import "bootstrap/dist/css/bootstrap.min.css";

const routes: Record<PageName, JSX.Element> = {
  tryOperation: <TryOperation />,
  response: <Response />,
  error: <Error />,
  loading: <div>Loading...</div>,
};

const requestHandlers: Record<Webapp["request"]["command"], Function> = {
  changeTheme,
  tryOperation,
  showResponse,
  showError,
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

function renderWebView(host: Webapp["host"], theme: ThemeState) {
  const store = initStore(createListener(host), theme);

  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );

  window.addEventListener("message", (event) => {
    const { command, payload } = event.data as Webapp["request"];
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
