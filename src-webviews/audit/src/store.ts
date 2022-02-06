import { configureStore, StateFromReducersMapObject } from "@reduxjs/toolkit";
import kdbReducer, { KdbState } from "./kdbSlice";
import reportReducer from "./reportSlice";
import { HostApplication } from "./types";

const reducer = {
  report: reportReducer,
  kdb: kdbReducer,
};

export const initStore = (hostApplication: HostApplication, kdb: KdbState) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: hostApplication,
        },
      }),
    preloadedState: {
      kdb,
    },
  });

export type RootState = StateFromReducersMapObject<typeof reducer>;
export type AppDispatch = ReturnType<typeof initStore>["dispatch"];
