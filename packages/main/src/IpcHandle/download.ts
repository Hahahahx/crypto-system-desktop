import { BrowserWindow, IpcMainEvent } from "electron";
import { File } from "../../../common/IpcEvent";

export class DownloadChannel implements IpcChannelInterface {
  type = File.Download;

  allDownloadSize = 0;

  allFilesize = 0;

  handle(event: IpcMainEvent, request?: IpcRequest): void {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
      window.webContents.downloadURL(request?.params.url);
      window.webContents.session.on("will-download", (e, item) => {
        this.allFilesize += request?.params.Size;
        event.sender.send(this.type, {
          allDownloadSize: this.allDownloadSize,
          allFilesize: this.allFilesize,
        });

        item.on("updated", (e, state) => {
          this.allDownloadSize += item.getReceivedBytes();
          BrowserWindow.getAllWindows().forEach((window) => {
            window.webContents.send("updated_" + request?.params.CID, {
              savePath: item.getSavePath(),
              state,
              isPaused: item.isPaused(),
              byte: item.getReceivedBytes(),
              allDownloadSize: this.allDownloadSize,
              allFilesize: this.allFilesize,
            });
          });
        });

        item.on("done", (e, state) => {
          this.allFilesize -= request?.params.Size;
          if (state === "completed") {
            this.allDownloadSize -= request?.params.Size;
          }
          BrowserWindow.getAllWindows().forEach((window) => {
            window.webContents.send("done_" + request?.params.CID, {
              savePath: item.getSavePath(),
              state,
              allDownloadSize: this.allDownloadSize,
              allFilesize: this.allFilesize,
            });
          });
        });
      });
    }
  }
}
