export type Message = {
  command: string;
  payload: any;
};

export type AbstractWebapp = {
  request: Message;
  response: Message;
  host: {
    postMessage(message: Message): void;
  };
};

export type Webapp<RQ extends Message, RS extends Message> = {
  request: RQ;
  response: RS;
  host: {
    postMessage(message: RS): void;
  };
};
