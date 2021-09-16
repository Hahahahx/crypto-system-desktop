import { app, ipcMain, nativeImage } from "electron";
import { BrowserWindow } from "./browserWindow";
import { disableShortcuts } from "./shortcuts.keys";
import { isDevMode, isProMode, platform } from "./utils";
import { Tray } from "./tray";
import logo from "../../../buildResources/icon.png";

export class Main {
  private mainWindow?: BrowserWindow;
  // 当我们声明Tray模块中的变量时，
  // 没有将其声明为全局变量，导致在运行过程中，会被垃圾回收机制回收掉。
  private tray?: Tray;

  public init(): Main {
    const isSingleInstance = app.requestSingleInstanceLock();
    if (!isSingleInstance) {
      app.quit();
      process.exit(0);
    }
    // 禁用GPU渲染
    // 如果不禁用该项就得确保GPU的正常
    // GPU如果被关闭就会照成程序黑屏
    // 此处我们还是选择开启它
    // 显然，有GPU的帮助页面效果就不至于太卡顿
    // app.disableHardwareAcceleration();
    this.whenReady();
    app.on("window-all-closed", this.onWindowAllClosed);
    app.on("second-instance", this.onSecondInstance);
    app.on("will-quit", this.onWillQuit);

    // 遇到中断信号直接关闭软件
    if (isDevMode) {
      if (platform.isWin) {
        process.on("message", (data) => {
          if (data === "graceful-exit") {
            app.quit();
          }
        });
      } else {
        process.on("SIGTERM", () => {
          app.quit();
        });
      }
    }

    return this;
  }

  public registerIpcChannels(ipcChannels: IpcChannelInterface[]): Main {
    ipcChannels.forEach((channel) =>
      ipcMain.on(channel.type, (event, request) =>
        channel.handle(event, request ? JSON.parse(request) : undefined)
      )
    );
    return this;
  }

  private onWillQuit() {
    console.log("app will quit");
    return;
  }

  // Someone tried to run a second instance, we should focus our window.
  private onSecondInstance() {
    if (this.mainWindow) {
      if (this.mainWindow.window.isMinimized())
        this.mainWindow.window.restore();
      this.mainWindow.window.focus();
    }
  }

  private onWindowAllClosed() {
    if (!platform.isDarwin) {
      app.quit();
      //   app.exit();
    }
  }

  private whenReady() {
    app
      .whenReady()
      .then(() => {
        disableShortcuts();
        this.mainWindow = new BrowserWindow({
          options: {
            minHeight: 600,
            minWidth: 1000,
            height: 600,
            width: 1000,
          },
        });
        this.mainWindow.toShow();
        this.tray = new Tray(nativeImage.createFromDataURL(logo)).init(
          this.mainWindow
        );
      })
      .catch((e) => console.error("Failed create window:", e));

    // Auto-updates
    if (isProMode) {
      app
        .whenReady()
        .then(() => import("electron-updater"))
        .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
        .catch((e) => console.error("Failed check updates:", e));
    }

    // Install "react.js devtools"
    if (isDevMode) {
      app
        .whenReady()
        .then(() => import("electron-devtools-installer"))
        .then(({ default: installExtension, REACT_DEVELOPER_TOOLS }) =>
          installExtension(
            REACT_DEVELOPER_TOOLS,
            true
            //   {
            //   loadExtensionOptions: {
            //     allowFileAccess: true,
            //   },
            // }
          )
        )
        .catch((e) => console.error("Failed install extension:", e));
    }
  }
}
