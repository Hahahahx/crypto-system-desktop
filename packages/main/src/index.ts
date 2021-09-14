import { WindowOpt } from "../../common/IpcEvent";
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
  ]);
