export interface Message {
  command: string;
  payload: any;
}

export interface HostApplication<Response extends Message> {
  postMessage(message: Response): void;
}
