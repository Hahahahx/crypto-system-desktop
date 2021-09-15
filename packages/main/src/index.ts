import { Crypto, Dialog, WindowOpt } from "../../common/IpcEvent";
import { CryptoChannel, initCrypt } from "./IpcHandle/crypt";
import { DialogChannel } from "./IpcHandle/dialog";
import { DownloadChannel } from "./IpcHandle/download";
import {
  WindowChannel,
  WindowCloseChannel,
  WindowMaxChannel,
  WindowMinChannel,
  WindowCurrentChannel,
} from "./IpcHandle/window";
import { Main } from "./main";

new Main()
  .init()
  .registerIpcChannels([
    new WindowChannel(WindowOpt.Modal),
    new WindowChannel(WindowOpt.ChildWindow),
    new WindowChannel(WindowOpt.Window),
    new WindowMinChannel(),
    new WindowMaxChannel(),
    new WindowCloseChannel(),
    new WindowCurrentChannel(),
    new CryptoChannel(Crypto.Md5, (opt) => `md5  ${opt.file}`),
    new CryptoChannel(Crypto.Encrypt, (opt) => `encrypt ${opt.file}`),
    new CryptoChannel(
      Crypto.Decrypt,
      (opt) => `decrypt -k ${opt.key} -n ${opt.name} ${opt.file}`
    ),
    new DownloadChannel(),
    new DialogChannel(Dialog.Save),
  ]);
initCrypt();
