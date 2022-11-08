import { Webapp as App } from "../message";
import { ThemeRequests } from "../messages/theme";
import { Audit, Kdb } from "../audit";

declare type ShowFullReportMessage = {
  command: "showFullReport";
  payload: Audit;
};

declare type ShowPartialReportMessage = {
  command: "showPartialReport";
  payload: { report: Audit; uri: string; ids: any[] };
};

declare type ShowNoReportMessage = {
  command: "showNoReport";
  payload: unknown;
};

declare type LoadKdbMessage = {
  command: "loadKdb";
  payload: Kdb;
};

type GoToLineMessage = {
  command: "goToLine";
  payload: { uri: string; line: number; pointer: string };
};

type CopyIssueIdMessage = {
  command: "copyIssueId";
  payload: string;
};

type OpenLinkMessage = {
  command: "openLink";
  payload: string;
};

type Request =
  | ShowFullReportMessage
  | ShowPartialReportMessage
  | ShowNoReportMessage
  | LoadKdbMessage
  | ThemeRequests;

type Response = GoToLineMessage | CopyIssueIdMessage | OpenLinkMessage;

export type Webapp = App<Request, Response>;
