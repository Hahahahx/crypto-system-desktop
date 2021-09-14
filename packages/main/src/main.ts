import { app, ipcMain } from "electron";
import { BrowserWindow } from "./browserWindow";
import { disableShortcuts } from "./shortcuts.keys";
import { isDevMode, isProMode, platform } from "./utils";

export class Main {
  private mainWindow?: BrowserWindow;

  public init(): Main {
    const isSingleInstance = app.requestSingleInstanceLock();
    if (!isSingleInstance) {
      app.quit();
      process.exit(0);
    }
    app.disableHardwareAcceleration();
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
        channel.handle(event, request ? JSON.parse(request) : undefined),
      ),
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
        this.mainWindow = new BrowserWindow();
        this.mainWindow.toShow();
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
            true,
            //   {
            //   loadExtensionOptions: {
            //     allowFileAccess: true,
            //   },
            // }
          ),
        )
        .catch((e) => console.error("Failed install extension:", e));
    }
  }
}
