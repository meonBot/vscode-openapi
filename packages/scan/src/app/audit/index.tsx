import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { Webapp } from "@xliic/common/webapp/audit";

import { initStore, createListener } from "./store";
import ThemeStyles from "../../features/theme/ThemeStyles";
import { ThemeState, changeTheme } from "../../features/theme/slice";

import { showFullReport, showPartialReport, showNoReport, loadKdb } from "./slice";

import Main from "./components/Main";

import "bootstrap/dist/css/bootstrap.min.css";

const requestHandlers: Record<Webapp["request"]["command"], Function> = {
  showFullReport,
  showPartialReport,
  showNoReport,
  loadKdb,
  changeTheme,
};

function App() {
  return (
    <>
      <ThemeStyles />
      <Main />
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
