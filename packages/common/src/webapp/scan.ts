import { ScanRequest, ScanResponse } from "../messages/scan";
import { PrefRequest, PrefResponse } from "../messages/prefs";
import { EnvRequest, EnvResponse } from "../messages/env";
import { ThemeRequests } from "../messages/theme";
import { HostApplication } from "../message";

export type WebappRequest = ScanRequest | EnvRequest | PrefRequest | ThemeRequests;
export type WebappResponse = ScanResponse | EnvResponse | PrefResponse;
export type WebappHost = HostApplication<WebappResponse>;
