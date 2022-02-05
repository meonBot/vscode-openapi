import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Summary, Issue, Audit } from "./types";

export interface ReportState {
  summary: Summary;
  full: boolean;
  all: Issue[];
  selected: Issue[];
}

const initialState: ReportState = {
  summary: {
    documentUri: "",
    subdocumentUris: [],
    errors: false,
    invalid: false,
    all: 0,
    datavalidation: { max: 0, value: 0 },
    security: { max: 0, value: 0 },
    oasconformance: { max: 0, value: 0 },
  },
  full: true,
  all: [],
  selected: [
    {
      id: "operation-securityrequirement-emptyarray",
      description: "The security section of the operation 'post' contains an empty array",
      pointer: "/paths/~1api~1login/post/security",
      score: 3.75,
      displayScore: "4",
      criticality: 4,
      documentUri: "file:///Users/anton/crunch/oas-samples/Pixi_2.0.json",
      lineNo: 125,
      key: "file:///Users/anton/crunch/oas-samples/Pixi_2.0.json-0",
    },
  ],
};

function flattenIssues(audit: Audit): Issue[] {
  const issues = Object.entries(audit.issues)
    .map(([uri, issues]) => {
      return issues.map((issue, idx) => ({ ...issue, key: `${uri}-${idx}` }));
    })
    .reduce((acc: any, val) => acc.concat(val), []);
  return issues;
}

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    show: (state, action: PayloadAction<any>) => {
      console.log("do show", action);
      state.all = state.selected = flattenIssues(action.payload);
      state.full = true;
    },
    showIds: (state, action: PayloadAction<{ report: any; uri: string; ids: string[] }>) => {
      console.log("do show ids", action.payload.report);
      const issues = flattenIssues(action.payload.report);
      const ids = action.payload.ids.map((id) => `${action.payload.uri}-${id}`);
      state.all = issues;
      state.selected = issues.filter((issue) => ids.includes(issue.key));
      state.full = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { show, showIds } = reportSlice.actions;

export default reportSlice.reducer;
