import { ThemeRequests } from "../messages/theme";
import { HostApplication } from "../message";
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

export type WebappRequest =
  | ShowFullReportMessage
  | ShowPartialReportMessage
  | ShowNoReportMessage
  | LoadKdbMessage
  | ThemeRequests;

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

export type WebappResponse = GoToLineMessage | CopyIssueIdMessage | OpenLinkMessage;

export type WebappHost = HostApplication<WebappResponse>;
