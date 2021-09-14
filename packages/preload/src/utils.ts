import { ipcRenderer } from "electron";

const ipcSendOnce = (
  channel: string,
  params?: any,
): Promise<{ event: Electron.IpcRendererEvent; args: any }> => {
  ipcRenderer.send(
    channel,
    JSON.stringify({
      params,
    }),
  );

  return new Promise((res, rej) => {
    ipcRenderer.once(channel, (event, args) => {
      res({
        event,
        args,
      });
    });
  });
};

const ipcSend = (
  channel: string,
  params?: any,
): Promise<{ event: Electron.IpcRendererEvent; args: any }> => {
  ipcRenderer.send(
    channel,
    JSON.stringify({
      params,
    }),
  );

  return new Promise((res, rej) => {
    ipcRenderer.on(channel, (event, args) => {
      res({
        event,
        args,
      });
    });
  });
};

export { ipcSend, ipcSendOnce };
