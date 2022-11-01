import { ScanRequest, ScanResponse } from "../messages/scan";
import { PrefRequest, PrefResponse } from "../messages/prefs";
import { EnvRequest, EnvResponse } from "../messages/env";

export type WebappRequest = ScanRequest | EnvRequest | PrefRequest;
export type WebappResponse = ScanResponse | EnvResponse | PrefResponse;
