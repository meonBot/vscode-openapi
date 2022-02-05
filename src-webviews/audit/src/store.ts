import { configureStore, StateFromReducersMapObject } from "@reduxjs/toolkit";
import kdbReducer, { KdbState } from "./kdbSlice";
import reportReducer from "./reportSlice";

const reducer = {
  report: reportReducer,
  kdb: kdbReducer,
};

export const initStore = (kdb: KdbState) =>
  configureStore({
    reducer,
    preloadedState: {
      kdb,
    },
  });

export type RootState = StateFromReducersMapObject<typeof reducer>;
export type AppDispatch = ReturnType<typeof initStore>["dispatch"];
