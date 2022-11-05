import {
  configureStore,
  ListenerMiddlewareInstance,
  StateFromReducersMapObject,
} from "@reduxjs/toolkit";
import logger from "redux-logger";

import { createListenerMiddleware, TypedStartListening } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { WebappHost } from "@xliic/common/webapp/audit";

import theme, { ThemeState } from "../../features/theme/slice";

import audit, { goToLine, copyIssueId, openLink } from "./slice";

const reducer = {
  audit,
  theme,
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

export function createListener(host: WebappHost) {
  startAppListening({
    actionCreator: goToLine,
    effect: async (action, listenerApi) => {
      host.postMessage({
        command: "goToLine",
        payload: action.payload,
      });
    },
  });

  startAppListening({
    actionCreator: copyIssueId,
    effect: async (action, listenerApi) => {
      host.postMessage({
        command: "copyIssueId",
        payload: action.payload,
      });
    },
  });

  startAppListening({
    actionCreator: openLink,
    effect: async (action, listenerApi) => {
      host.postMessage({
        command: "openLink",
        payload: action.payload,
      });
    },
  });

  return listenerMiddleware;
}
