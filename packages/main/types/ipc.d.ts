interface IpcChannelInterface {
  type: string;

  handle(event: IpcMainEvent, request?: IpcRequest): void;
}
