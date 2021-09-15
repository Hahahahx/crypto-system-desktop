import { BrowserWindow, dialog, IpcMainEvent } from "electron";
import { Dialog } from "../../../common/IpcEvent";

export class DialogChannel implements IpcChannelInterface {
  type: Dialog;
  constructor(v: Dialog) {
    this.type = v;
  }

  handle(event: IpcMainEvent, request?: IpcRequest): void {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
      const path = dialog.showSaveDialogSync(window, request?.params);
      event.sender.send(this.type, { path });
    }
  }
}
