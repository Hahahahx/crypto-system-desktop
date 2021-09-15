import { contextBridge, shell, clipboard } from "electron";
import { ElectronApi } from "types/electron-api";
import * as ipfs from "./function/ipfs";
import {
  getChildWindow,
  getModal,
  getWindow,
  windowClose,
  windowMax,
  windowMin,
} from "./function/window";
import { ipcSendOnce } from "./utils";
import { createReadStream, existsSync } from "fs";
import { extname, dirname } from "path";
import { download } from "./function/download";
import * as dialog from "./function/dialog";

const apiKey = "electron";
/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api: ElectronApi = {
  download,
  fs: {
    createReadStream,
    existsSync,
  },
  path: {
    extname,
    dirname,
  },
  ipfs,
  shell,
  clipboard,
  dialog,
  versions: process.versions,
  getWindow,
  getModal,
  getChildWindow,
  windowClose,
  windowMax,
  windowMin,
  handleIpcRenderer: ipcSendOnce,
};

/**
 * If contextIsolated enabled use contextBridge
 * Else use fallback
 *
 * Note: Spectron tests can't work in isolated context
 * @see https://github.com/electron-userland/spectron/issues/693#issuecomment-748482545
 */
if (process.contextIsolated) {
  /**
   * The "Main World" is the JavaScript context that your main renderer code runs in.
   * By default, the page you load in your renderer executes code in this world.
   *
   * @see https://www.electronjs.org/docs/api/context-bridge
   */
  contextBridge.exposeInMainWorld(apiKey, api);
} else {
  /**
   * Recursively Object.freeze() on objects and functions
   * @see https://github.com/substack/deep-freeze
   * @param obj Object on which to lock the attributes
   */
  const deepFreeze = (obj: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    if (typeof obj === "object" && obj !== null) {
      Object.keys(obj).forEach((prop) => {
        const val = obj[prop];
        if (
          (typeof val === "object" || typeof val === "function") &&
          !Object.isFrozen(val)
        ) {
          deepFreeze(val);
        }
      });
    }

    return Object.freeze(obj);
  };

  deepFreeze(api);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window[apiKey] = api;

  // Need for Spectron tests
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.electronRequire = require;
}
