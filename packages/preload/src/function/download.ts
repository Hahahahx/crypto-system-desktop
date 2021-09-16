import { ipcRenderer } from "electron";
import { File } from "../../../common/IpcEvent";
import { ipcSendOnce } from "../utils";

export const download = (
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
    allDownloadSize: number;
    allFilesize: number;
    savePath: string;
    state: string;
    isPaused: boolean;
    byte: number;
  }) => void
): Promise<{ savePath: string; state: string }> => {
  // 请求下载
  return ipcSendOnce(File.Download, {
    ...params,
  }).then((res) => {
    const linster = (e: any, args: any) => {
      onUpdated({ ...params, ...args });
    };
    // 监听下载
    ipcRenderer.on("updated_" + params.CID, linster);
    // 下载结束
    return new Promise((res, rej) => {
      ipcRenderer.once(
        "done_" + params.CID,
        (e, args: { savePath: string; state: string }) => {
          ipcRenderer.removeListener("updated_" + params.CID, linster);
          if (args.state === "completed") {
            res(args);
          } else {
            rej(args);
          }
        }
      );
    });
  });
};
