import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { scanOperation, showScanReport, showScanResponse as showScanResponse } from "./slice";

export type PageName =
  | "loading"
  | "scanOperation"
  | "scanReport"
  | "scanResponse"
  | "tryOperation"
  | "response"
  | "error"
  | "env";

export interface RouteState {
  page: PageName;
  history: PageName[];
  routes: any;
}

const initialState: RouteState = {
  page: "loading",
  history: [],
  routes: {
    scan: { title: "Scan" },
    report: { title: "Report" },
    env: { title: "Environment" },
  },
};

export const slice = createSlice({
  name: "route",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(scanOperation, (state) => {
      _goTo(state, "scanOperation");
    });

    builder.addCase(showScanReport, (state) => {
      _goTo(state, "scanReport");
    });

    builder.addCase(showScanResponse, (state) => {
      _goTo(state, "scanResponse");
    });
  },
  reducers: {
    goTo: (state, action: PayloadAction<PageName>) => {
      _goTo(state, action.payload);
    },

    goBack: (state) => {
      if (state.history.length > 0) {
        state.page = state.history.pop()!;
      }
    },
  },
});

function _goTo(state: WritableDraft<RouteState>, page: PageName) {
  state.history.push(state.page);
  state.page = page;
}

export const { goBack, goTo } = slice.actions;

export default slice.reducer;
