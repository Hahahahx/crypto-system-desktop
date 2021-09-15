import { IPFSHTTPClient } from "ipfs-http-client";
import {
  BrowserWindowConstructorOptions,
  IpcRendererEvent,
  Shell,
  Dialog,
  Clipboard,
  WebContents,
} from "electron";

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
  versions: Readonly<NodeJS.ProcessVersions>;
  getModal: (route: string, options?: BrowserWindowConstructorOptions) => void;
  getWindow: (route: string, options?: BrowserWindowConstructorOptions) => void;
  getChildWindow: (
    route: string,
    options?: BrowserWindowConstructorOptions
  ) => void;
  windowClose: () => void;
  windowMax: () => Promise<{
    event: IpcRendererEvent;
    args: { result: boolean };
  }>;
  windowMin: () => Promise<{
    event: IpcRendererEvent;
    args: { result: boolean };
  }>;
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
    url: string,
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
}

type ElectronApi = Api;

declare interface Window {
  electron: Readonly<ElectronApi>;
  electronRequire?: NodeRequire;
}
