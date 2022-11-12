import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { UnionToIntersection } from "type-fest";

export type Message = {
  command: string;
  payload: any;
};

export type Webapp<RQ extends Message, RS extends Message> = {
  request: RQ;
  response: RS;
  requestHandler: UnionToIntersection<
    RQ extends Message
      ? { [key in RQ["command"]]: ActionCreatorWithPayload<RQ["payload"], string> }
      : never
  >;

  responseHandler: UnionToIntersection<
    RS extends Message
      ? { [key in RS["command"]]: (payload: RS["payload"]) => Promise<RQ | void> }
      : never
  >;

  host: {
    postMessage(message: RS): void;
  };
};
