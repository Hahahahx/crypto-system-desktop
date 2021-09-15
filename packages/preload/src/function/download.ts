import { ipcRenderer } from "electron";
import { File } from "../../../common/IpcEvent";
import { ipcSendOnce } from "../utils";

export const download = (
  url: string,
  onUpdated: (args: {
    savePath: string;
    state: string;
    isPaused: boolean;
    byte: number;
  }) => void
): Promise<{ savePath: string; state: string }> => {
  // 请求下载
  return ipcSendOnce(File.Download, {
    url,
  }).then((res) => {
    const linster = (e: any, args: any) => {
      onUpdated(args);
    };
    // 监听下载
    ipcRenderer.on("updated_" + url, linster);
    // 下载结束
    return new Promise((res, rej) => {
      ipcRenderer.removeListener("updated_" + url, linster);
      ipcRenderer.once(
        "done_" + url,
        (e, args: { savePath: string; state: string }) => {
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
