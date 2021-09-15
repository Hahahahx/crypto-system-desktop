import { Footer } from "./layout/footer";
import { Header } from "./layout/header";
import Icon from "./icon/icon";
import { Sider } from "./layout/sider";
import { Tabs } from "./tab/tabs";
import { IpfsConfig } from "./config";
import { Files } from "./files";
import { DownloadFiles } from "./files/downloadPage";
import { UploadFiles } from "./files/uploadPage";

export const page = {
  config: IpfsConfig,
  allFile: Files,
  uploadFile: UploadFiles,
  downloadFile: DownloadFiles,
};

export type PageName = keyof typeof page;


export interface PageProps {
  page: PageName;
  icon: string;
  name: string;
  params?: {
    [k: string]: any;
  };
}

export { Header, Sider, Footer, Tabs, Icon };
