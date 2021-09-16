import { IPFSHTTPClient } from "ipfs-http-client";
import {
  BrowserWindowConstructorOptions,
  IpcRendererEvent,
  Shell,
  Dialog,
  Clipboard,
  WebContents,
} from "electron";

type ipcFuncReturn = () => Promise<{
  event: Electron.IpcRendererEvent;
  args: any;
}>;

type ipcFuncWindowCreate = (
  route: string,
  options?: BrowserWindowConstructorOptions
) => void;

type ipcFuncWindowOpt = () => Promise<{
  event: IpcRendererEvent;
  args: { result: boolean };
}>;

interface Api {
  ipfs: {
    connect: (url: string) => Promise<{
      addresses: string[];
      id: string;
      publicKey: string;
      agentVersion: string;
      protocolVersion: string;
      protocols: string[];
    }>;
    id: () => Promise<{
      addresses: string[];
      id: string;
      publicKey: string;
      agentVersion: string;
      protocolVersion: string;
      protocols: string[];
    }>;
    add: (
      path: string,
      progress: (bt: number, path?: string | undefined) => void
    ) => Promise<{
      cid: string;
      size: number;
      path: string;
      mode?: number;
    }>;
    repo: {
      stat: () => Promise<{
        storageMax: string;
        numObjects: string;
        repoSize: string;
        repoPath: string;
        version: string;
      }>;
    };
    config: {
      show: () => Promise<Config>;
    };
    swarm: {
      peers: () => Promise<
        {
          addr: string;
          peer: string;
          latency?: string | undefined;
          muxer?: string | undefined;
          streams?: string[] | undefined;
          direction?: "inbound" | "outbound" | undefined;
        }[]
      >;
    };
  };

  browserWindow: {
    getModal: ipcFuncWindowCreate;
    getWindow: ipcFuncWindowCreate;
    getChildWindow: ipcFuncWindowCreate;
    windowClose: () => void;
    windowMax: ipcFuncWindowOpt;
    windowMin: ipcFuncWindowOpt;
    appQuit: ipcFuncReturn;
    toggleMainWindow: ipcFuncReturn;
  };
  versions: Readonly<NodeJS.ProcessVersions>;
  handleIpcRenderer: (
    channel: string,
    params?: any
  ) => Promise<{
    event: Electron.IpcRendererEvent;
    args: any;
  }>;

  fs: {
    createReadStream: (
      path: PathLike,
      options?: BufferEncoding | ReadStreamOptions | undefined
    ) => ReadStream;
    existsSync: (path: PathLike) => boolean;
  };
  path: {
    extname(p: string): string;
    dirname(p: string): string;
  };
  shell: Shell;
  dialog: {
    showSaveDialogSync: (options: SaveDialogSyncOptions) => Promise<{
      event: Electron.IpcRendererEvent;
      args: any;
    }>;
  };
  clipboard: Clipboard;
  download: (
    params: {
      url: string;
      CID: string;
      Ctime?: string;
      Encrypt: boolean;
      Key: string;
      MD5: string;
      Name: string;
      Size: number;
    },
    onUpdated: (args: {
      savePath: string;
      state: string;
      isPaused: boolean;
      byte: number;
    }) => void
  ) => Promise<{
    savePath: string;
    state: string;
  }>;
  isDev: boolean;
  mainPath: string;
}

type ElectronApi = Api;

declare interface Window {
  electron: Readonly<ElectronApi>;
  electronRequire?: NodeRequire;
}
