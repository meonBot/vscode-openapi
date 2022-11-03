import { DataDictionaryRequest, DataDictionaryResponse } from "../messages/data-dictionary";
import { ThemeRequests } from "../messages/theme";
import { HostApplication } from "../message";

export type WebappRequest = DataDictionaryRequest | ThemeRequests;
export type WebappResponse = DataDictionaryResponse;
export type WebappHost = HostApplication<WebappResponse>;
