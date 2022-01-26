export interface SummaryData {
  datavalidation: Grade;
  security: Grade;
  oasconformance: Grade;
  all: number;
}

interface Grade {
  value: number;
  max: number;
}

export interface Grades {
  datavalidation: Grade;
  security: Grade;
  oasconformance: Grade;
  all: number;
  errors: boolean;
  invalid: boolean;
}

export interface Summary extends Grades {
  documentUri: string;
  subdocumentUris: string[];
}

export interface ReportedIssue {
  id: string;
  description: string;
  pointer: string;
  score: number;
  displayScore: string;
  criticality: 1 | 2 | 3 | 4 | 5;
}

export interface Issue extends ReportedIssue {
  lineNo: number;
  documentUri: string;
}

export interface IssuesByDocument {
  [uri: string]: Issue[];
}

export interface Audit {
  filename: string;
  summary: Summary;
  issues: IssuesByDocument;
}
