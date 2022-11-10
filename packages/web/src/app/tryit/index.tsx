import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { Webapp } from "@xliic/common/webapp/tryit";

import { initStore, createListener } from "./store";
import ThemeStyles from "../../features/theme/ThemeStyles";
import { ThemeState, changeTheme } from "../../features/theme/slice";
import Router from "../../features/router/Router";
import Navigation from "../../features/router/Navigation";
import { RouterContext, Routes } from "../../features/router/RouterContext";
import { showResponse, showError, tryOperation } from "./slice";
import { loadEnv } from "../../features/env/slice";
import { loadPrefs } from "../../features/prefs/slice";
import Env from "../../features/env/Env";

import TryOperation from "./TryOperation";
import Response from "./Response";
import Error from "./Error";

import "bootstrap/dist/css/bootstrap.min.css";

const routes: Routes = [
  {
    id: "tryit",
    title: "Try It",
    element: <TryOperation />,
    when: tryOperation,
    children: [
      { id: "response", title: "Response", element: <Response />, when: showResponse },
      { id: "error", title: "Error", element: <Error />, when: showError },
    ],
  },
  { id: "env", title: "Environment", element: <Env /> },
];

const requestHandlers: Record<Webapp["request"]["command"], Function> = {
  changeTheme,
  tryOperation,
  showResponse,
  showError,
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
