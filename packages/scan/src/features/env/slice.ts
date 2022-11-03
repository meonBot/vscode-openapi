import { createSlice, PayloadAction, Dispatch, StateFromReducersMapObject } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import { EnvData, NamedEnvironment } from "@xliic/common/messages/env";

export interface EnvState {
  data: EnvData;
}

const initialState: EnvState = {
  data: { default: {}, secrets: {} },
};

export const slice = createSlice({
  name: "env",
  initialState,
  reducers: {
    loadEnv: (state, action: PayloadAction<EnvData>) => {
      state.data = action.payload;
    },
    saveEnv: (state, action: PayloadAction<NamedEnvironment>) => {
      state.data[action.payload.name] = action.payload.environment;
    },
  },
});

export const { loadEnv, saveEnv } = slice.actions;

export const useFeatureDispatch: () => Dispatch<
  ReturnType<typeof slice.actions[keyof typeof slice.actions]>
> = useDispatch;

export const useFeatureSelector: TypedUseSelectorHook<
  StateFromReducersMapObject<Record<typeof slice.name, typeof slice.reducer>>
> = useSelector;

export default slice.reducer;
