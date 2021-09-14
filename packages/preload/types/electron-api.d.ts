interface Api {
  versions: Readonly<NodeJS.ProcessVersions>;
  getModal: (
    route: string,
    options?: Electron.BrowserWindowConstructorOptions
  ) => void;
  getWindow: (
    route: string,
    options?: Electron.BrowserWindowConstructorOptions
  ) => void;
  getChildWindow: (
    route: string,
    options?: Electron.BrowserWindowConstructorOptions
  ) => void;
  windowClose: () => void;
  windowMax: () => Promise<{
    event: Electron.IpcRendererEvent;
    args: { result: boolean };
  }>;
  windowMin: () => Promise<{
    event: Electron.IpcRendererEvent;
    args: { result: boolean };
  }>;
}

type ElectronApi = Readonly<Api>;

declare interface Window {
  electron: Readonly<ElectronApi>;
  electronRequire?: NodeRequire;
}
