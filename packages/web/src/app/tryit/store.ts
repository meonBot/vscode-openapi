import {
  configureStore,
  ListenerMiddlewareInstance,
  StateFromReducersMapObject,
} from "@reduxjs/toolkit";
import logger from "redux-logger";

import { createListenerMiddleware, isAnyOf, TypedStartListening } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { Webapp } from "@xliic/common/webapp/tryit";

import theme, { ThemeState } from "../../features/theme/slice";
import tryit, { sendRequest, createSchema, saveConfig } from "./slice";
import env, { saveEnv } from "../../features/env/slice";
import prefs, { setTryitServer, setSecretForSecurity } from "../../features/prefs/slice";
import router from "../../features/router/slice";
import { startNavigationListening } from "../../features/router/listener";
import { Routes } from "../../features/router/RouterContext";

const reducer = {
  theme,
  tryit,
  router,
  env,
  prefs,
};

export const initStore = (listenerMiddleware: ListenerMiddlewareInstance, theme: ThemeState) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(logger),
    preloadedState: {
      theme,
    },
  });

export type RootState = StateFromReducersMapObject<typeof reducer>;
export type AppDispatch = ReturnType<typeof initStore>["dispatch"];

const listenerMiddleware = createListenerMiddleware();
type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startAppListening = listenerMiddleware.startListening as AppStartListening;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function createListener(host: Webapp["host"], routes: Routes) {
  startNavigationListening(startAppListening, routes);

  startAppListening({
    actionCreator: sendRequest,
    effect: async (action, listenerApi) => {
      host.postMessage({ command: "sendRequest", payload: action.payload.request });
    },
  });

  startAppListening({
    actionCreator: createSchema,
    effect: async (action, listenerApi) => {
      host.postMessage({ command: "createSchema", payload: action.payload.response });
    },
  });

  startAppListening({
    actionCreator: saveConfig,
    effect: async (action, listenerApi) => {
      const state = listenerApi.getState();
      host.postMessage({ command: "saveConfig", payload: state.tryit.tryitConfig });
    },
  });

  startAppListening({
    matcher: isAnyOf(setTryitServer, setSecretForSecurity),
    effect: async (action, listenerApi) => {
      const { prefs } = listenerApi.getState();
      host.postMessage({
        command: "savePrefs",
        payload: prefs,
      });
    },
  });

  return listenerMiddleware;
}
