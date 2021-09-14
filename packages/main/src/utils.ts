import { BrowserWindow as ElectronBrowserWindow } from "electron";

const isTestMode = import.meta.env.MODE === "test";
const isDevMode = import.meta.env.MODE === "development";
const isProMode = import.meta.env.MODE === "production";
const ViteDevServerUrl = import.meta.env.VITE_DEV_SERVER_URL;

class PlatForm extends String {
  isAix: boolean;
  isDarwin: boolean;
  isFreebsd: boolean;
  isLinux: boolean;
  isOpenbsd: boolean;
  isSunos: boolean;
  isWin: boolean;
  constructor() {
    super(process.platform);
    this.isAix = this.toString() === "aix";
    this.isDarwin = this.toString() === "darwin";
    this.isFreebsd = this.toString() === "freebsd";
    this.isLinux = this.toString() === "linux";
    this.isOpenbsd = this.toString() === "openbsd";
    this.isSunos = this.toString() === "sunos";
    this.isWin = this.toString() === "win32";
  }
}

const platform = new PlatForm();

const getWindow = (id: number): ElectronBrowserWindow | undefined => {
  return ElectronBrowserWindow.getAllWindows().find((window) => {
    return window.id == id;
  });
};

const ipcReplyCurrentWindow = (
  type: string,
  sender: Electron.WebContents,
  request: IpcRequest | undefined,
  data: any,
): void => {
  let res = request?.responseChannel;
  if (!res) {
    res = type;
  }
  sender.send(res, data);
};

export {
  isDevMode,
  isTestMode,
  ViteDevServerUrl,
  isProMode,
  platform,
  getWindow,
  ipcReplyCurrentWindow,
};
