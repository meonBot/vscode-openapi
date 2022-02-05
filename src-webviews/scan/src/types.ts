export interface HostApplication {
  postMessage(message: any): void;
}

export interface Issue {
  path: string;
  method: string;
  injectionDescription: string;
  responseDescription: string;
  curl: string;
}
