import { Webapp as App } from "../message";
import { DataDictionaryRequest, DataDictionaryResponse } from "../messages/data-dictionary";
import { ThemeRequests } from "../messages/theme";

export type Webapp = App<DataDictionaryRequest | ThemeRequests, DataDictionaryResponse>;
