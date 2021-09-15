import { SaveDialogSyncOptions } from "electron";
import { Dialog } from "../../../common/IpcEvent";
import { ipcSendOnce } from "../utils";

const showSaveDialogSync = (
  options: SaveDialogSyncOptions
): Promise<{
  event: Electron.IpcRendererEvent;
  args: any;
}> => {
  return ipcSendOnce(Dialog.Save, options);
};

export { showSaveDialogSync };
