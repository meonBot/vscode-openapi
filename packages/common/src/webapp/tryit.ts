import { TryItRequest, TryItResponse } from "../messages/tryit";
import { PrefRequest, PrefResponse } from "../messages/prefs";
import { EnvRequest, EnvResponse } from "../messages/env";
import { ThemeRequests } from "../messages/theme";
import { HostApplication } from "../message";

export type WebappRequest = TryItRequest | EnvRequest | PrefRequest | ThemeRequests;
export type WebappResponse = TryItResponse | EnvResponse | PrefResponse;
export type WebappHost = HostApplication<WebappResponse>;
