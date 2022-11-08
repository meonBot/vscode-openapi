import { Webapp as App } from "../message";
import { ScanRequest, ScanResponse } from "../messages/scan";
import { PrefRequest, PrefResponse } from "../messages/prefs";
import { EnvRequest, EnvResponse } from "../messages/env";
import { ThemeRequests } from "../messages/theme";

type Request = ScanRequest | EnvRequest | PrefRequest | ThemeRequests;
type Response = ScanResponse | EnvResponse | PrefResponse;

export type Webapp = App<Request, Response>;
