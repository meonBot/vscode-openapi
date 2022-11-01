import { TryItRequest, TryItResponse } from "../messages/tryit";
import { PrefRequest, PrefResponse } from "../messages/prefs";
import { EnvRequest, EnvResponse } from "../messages/env";

export type WebappRequest = TryItRequest | EnvRequest | PrefRequest;
export type WebappResponse = TryItResponse | EnvResponse | PrefResponse;
