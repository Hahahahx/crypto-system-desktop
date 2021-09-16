import { ipcMain, screen, Tray as ElectronTray, NativeImage } from "electron";
import { WindowOpt } from "../../common/IpcEvent";
import { BrowserWindow } from "./browserWindow";
import { isDevMode } from "./utils";

export class Tray {
  private tray: ElectronTray;
  private menu: BrowserWindow;
  constructor(icon: string | NativeImage) {
    this.tray = new ElectronTray(icon);
    this.menu = new BrowserWindow({
      route: "menu",
      options: {
        show: false,
        resizable: false,
        useContentSize: true,
        width: 220,
        height: 380,
        maxWidth: 220,
        maxHeight: 380,
        maximizable: false,
      },
    });
    this.menu.window.setSkipTaskbar(true);
    this.menu.window.setAlwaysOnTop(true, "pop-up-menu");
    this.menu.window.webContents.closeDevTools();
  }

  init(mainWindow: BrowserWindow): Tray {
    this.tray.setToolTip("ipfs-crypt by ux\n金钱猫科技股份有限公司");
    this.tray.on("click", this.onClick.bind(this, mainWindow));

    this.menu.window.on("blur", () => {
      this.menu.window.hide();
    });

    ipcMain.on(WindowOpt.ToggleMain, () => {
      this.onClick(mainWindow);
    });

    // 使用自定义窗口菜单
    // this.onMenu直接添加到事件队列中会改变this指向
    this.tray.on("right-click", this.onMenu.bind(this));

    // 使用系统菜单
    // this.setMenu();
    return this;
  }

  private onMenu() {
    const size = this.menu.window.getContentSize();
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    const point = screen.getCursorScreenPoint();

    let x = point.x;
    const y = point.y - size[1];
    if (x + size[0] > screenSize.width) {
      x -= size[0];
    }

    this.menu.window.setPosition(x, y, true);
    this.menu.window.show();
  }

  private onClick(mainWindow: BrowserWindow) {
    if (mainWindow.window.isVisible()) {
      mainWindow.window.hide();
    } else {
      mainWindow.window.show();
    }
  }
}
