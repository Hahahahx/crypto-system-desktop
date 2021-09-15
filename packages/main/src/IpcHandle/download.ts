import { BrowserWindow, IpcMainEvent } from "electron";
import { File } from "../../../common/IpcEvent";

export class DownloadChannel implements IpcChannelInterface {
  type = File.Download;

  handle(event: IpcMainEvent, request?: IpcRequest): void {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
      window.webContents.downloadURL(request?.params.url);
      window.webContents.session.on("will-download", (e, item) => {
        event.sender.send(this.type);

        item.on("updated", (e, state) => {
          BrowserWindow.getAllWindows().forEach((window) => {
            window.webContents.send("updated_" + request?.params.url, {
              savePath: item.getSavePath(),
              state,
              isPaused: item.isPaused(),
              byte: item.getReceivedBytes(),
            });
          });
        });

        item.on("done", (e, state) => {
          BrowserWindow.getAllWindows().forEach((window) => {
            window.webContents.send("done_" + request?.params.url, {
              savePath: item.getSavePath(),
              state,
            });
          });
        });
      });
    }
  }
}
