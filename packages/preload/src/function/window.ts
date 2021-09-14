import { WindowOpt } from "../../../common/IpcEvent";
import { ipcSendOnce } from "../utils";

/**
 * preload中无法拿到BrowserWindow对象
 * 没法使用getFocusedWindow
 * 对窗口的处理统一放置在主进程里
 */

/**
 * 打开一个模态框
 * @param route 路由
 * @param options 窗口信息
 */
const getModal = (
  route: string,
  options?: Electron.BrowserWindowConstructorOptions,
): void => {
  createWindow(route, WindowOpt.Modal, options);
};

/**
 * 打开子窗口，其parent会指向父窗口
 * @param route
 * @param options
 */
const getChildWindow = (
  route: string,
  options?: Electron.BrowserWindowConstructorOptions,
): void => {
  createWindow(route, WindowOpt.ChildWindow, options);
};

/**
 * 打开一个新窗口
 * @param route
 * @param options
 */
const getWindow = (
  route: string,
  options?: Electron.BrowserWindowConstructorOptions,
): void => {
  createWindow(route, WindowOpt.Window, options);
};

const createWindow = (
  route: string,
  type: WindowOpt,
  options?: Electron.BrowserWindowConstructorOptions,
) => {
  ipcSendOnce(type, {
    route,
    options,
  });
};

/**
 * 窗口最大化
 * 已经最大化的时候再次调用会恢复原大小
 * @returns
 */
const windowMax = (): Promise<{
  event: Electron.IpcRendererEvent;
  args: { result: boolean };
}> => {
  return ipcSendOnce(WindowOpt.Max);
};

/**
 * 窗口最小化
 * @returns
 */
const windowMin = (): Promise<{
  event: Electron.IpcRendererEvent;
  args: { result: boolean };
}> => {
  return ipcSendOnce(WindowOpt.Min);
};

/**
 * 关闭窗口
 * @returns
 */
const windowClose = () => {
  return ipcSendOnce(WindowOpt.Close);
};


export {
  getChildWindow,
  getWindow,
  getModal,
  windowClose,
  windowMax,
  windowMin,
};
