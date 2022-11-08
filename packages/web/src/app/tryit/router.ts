import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { tryOperation, showResponse, showError } from "./slice";

export type PageName = "loading" | "tryOperation" | "response" | "error";

export interface RouteState {
  page: PageName;
  history: PageName[];
}

const initialState: RouteState = {
  page: "loading",
  history: [],
};

export const slice = createSlice({
  name: "route",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(tryOperation, (state) => {
      _goTo(state, "tryOperation");
    });

    builder.addCase(showResponse, (state) => {
      _goTo(state, "response");
    });

    builder.addCase(showError, (state) => {
      _goTo(state, "error");
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
