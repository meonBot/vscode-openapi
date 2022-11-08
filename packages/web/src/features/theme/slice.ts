import { createSlice, PayloadAction, Dispatch, StateFromReducersMapObject } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { ChangeThemePayload } from "@xliic/common/messages/theme";

export interface ThemeState {
  theme?: ChangeThemePayload;
}

const initialState: ThemeState = {
  theme: undefined,
};

export const slice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<ChangeThemePayload>) => {
      state.theme = action.payload;
    },
  },
});

export const useFeatureDispatch: () => Dispatch<
  ReturnType<typeof slice.actions[keyof typeof slice.actions]>
> = useDispatch;

export const useFeatureSelector: TypedUseSelectorHook<
  StateFromReducersMapObject<Record<typeof slice.name, typeof slice.reducer>>
> = useSelector;

export const { changeTheme } = slice.actions;
export default slice.reducer;
