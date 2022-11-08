import { Webapp as App } from "../message";
import { TryItRequest, TryItResponse } from "../messages/tryit";
import { PrefRequest, PrefResponse } from "../messages/prefs";
import { EnvRequest, EnvResponse } from "../messages/env";
import { ThemeRequests } from "../messages/theme";

type Request = TryItRequest | EnvRequest | PrefRequest | ThemeRequests;
type Response = TryItResponse | EnvResponse | PrefResponse;

export type Webapp = App<Request, Response>;
