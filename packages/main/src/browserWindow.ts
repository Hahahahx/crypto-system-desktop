import { BrowserWindow as ElectronBrowserWindow } from "electron";
import { join } from "path";
import { isDevMode, isTestMode, ViteDevServerUrl } from "./utils";

export class BrowserWindow {
  id: string;
  route?: string;
  window: Electron.BrowserWindow;
  pageUrl: string;

  constructor(opt?: BrowserWindowOptions) {
    this.route = opt?.route;

    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../renderer/index.html` for production and test
     */
    this.pageUrl =
      isDevMode && ViteDevServerUrl
        ? ViteDevServerUrl
        : new URL(
            "../renderer/dist/index.html",
            "file://" + __dirname,
          ).toString();

    this.window = new ElectronBrowserWindow({
      ...opt?.options,
      show: false, // 使用 'ready-to-show' 事件来处理打开窗体
      frame: false,
      webPreferences: {
        preload: join(__dirname, "../../preload/dist/index.cjs"),
        contextIsolation: !isTestMode, // 非测试模式下 contextIsolation: true
        enableRemoteModule: isTestMode, // 非测试模式下 enableRemoteModule: false
      },
    });
    this.id = this.window.id.toString();
  }

  async toShow() {
    /**
     * 如果使用` show: ture `那么在关闭窗体时可能会遇到一些问题
     * 使用` show: false `然后用 ` ready-to-show `来监听窗体关闭事件可以解决这个问题
     *
     * @see https://github.com/electron/electron/issues/25012
     */
    this.window.on("ready-to-show", () => {
      this.window.show();

      if (isDevMode) {
        this.window.webContents.openDevTools();
      }
    });

    const url = this.route ? "#/" + this.route : "";
    await this.window.loadURL(this.pageUrl + url);
  }
}
