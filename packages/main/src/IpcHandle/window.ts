import { IpcMainEvent, BrowserWindow as ElectronBrowserWindow } from "electron";
import { WindowOpt } from "../../../common/IpcEvent";
import { BrowserWindow } from "../browserWindow";
import { getWindow, ipcReplyCurrentWindow } from "../utils";

export class WindowChannel implements IpcChannelInterface {
  constructor(v: WindowOpt) {
    this.type = v;
  }

  type: WindowOpt;

  handle(event: IpcMainEvent, request?: IpcRequest): void {
    try {
      const modal = this.type == WindowOpt.Modal;
      const parent =
        this.type === WindowOpt.ChildWindow || modal
          ? getWindow(event.sender.id)
          : undefined;

      const mainWindow = new BrowserWindow({
        route: request?.params.route,
        options: {
          ...request?.params.options,
          modal: true,
          parent,
        },
      });
      mainWindow.toShow();
      ipcReplyCurrentWindow(this.type, event.sender, request, {
        result: true,
      });
    } catch (error) {
      ipcReplyCurrentWindow(this.type, event.sender, request, {
        result: false,
      });
    }
  }
}

export class WindowMaxChannel implements IpcChannelInterface {
  type = WindowOpt.Max;
  handle(event: IpcMainEvent, request?: IpcRequest): void {
    const window = ElectronBrowserWindow.getFocusedWindow();
    if (window) {
      if (window.isMaximized()) {
        window.restore();
        ipcReplyCurrentWindow(this.type, event.sender, request, {
          result: false,
        });
      } else {
        window.maximize();
        ipcReplyCurrentWindow(this.type, event.sender, request, {
          result: true,
        });
      }
    }
  }
}

export class WindowMinChannel implements IpcChannelInterface {
  type = WindowOpt.Min;

  handle(event: IpcMainEvent, request?: IpcRequest): void {
    const window = ElectronBrowserWindow.getFocusedWindow();
    if (window) {
      window.minimize();
      ipcReplyCurrentWindow(this.type, event.sender, request, {
        result: true,
      });
    }
  }
}

export class WindowCloseChannel implements IpcChannelInterface {
  type = WindowOpt.Close;
  handle(event: IpcMainEvent, request?: IpcRequest): void {
    const window = ElectronBrowserWindow.getFocusedWindow();
    if (window) {
      window.close();
    }
  }
}

export class WindowCurrentChannel implements IpcChannelInterface {
  type = WindowOpt.Current;
  handle(event: IpcMainEvent, request?: IpcRequest): void {
    const window = ElectronBrowserWindow.getFocusedWindow();
    if (window) {
      ipcReplyCurrentWindow(this.type, event.sender, request, {
        result: window.isModal(),
      });
    }
  }
}
