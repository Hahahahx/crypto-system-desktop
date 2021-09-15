import { ElectronApi } from "../../../preload/types/electron-api";

export function useElectron(): ElectronApi {
  return window.electron;
}
