import { Update } from "ux-redux-module";
import { AuthApi } from "@/services";
import { useElectron } from "@/hooks/electron";
import { module } from ".";
import { message } from "antd";

export interface FileItem {
  CID: string;
  Ctime?: string;
  Encrypt: boolean;
  Key: string;
  MD5: string;
  Name: string;
  Size: number;
}

export interface UploadFileItem extends Partial<FileItem> {
  Process: number;
  Path: string;
  Cache?: string;
}
export interface DownloadFileItem extends Partial<FileItem> {
  Process: number;
  Path?: string;
  Cache?: string;
}

const { download, ipfs } = useElectron();

class FileModule {
  public allFiles: FileItem[] = [];
  public uploadFiles: UploadFileItem[] = [];
  public downloadFiles: DownloadFileItem[] = [];

  public getList() {
    AuthApi.GetList().then((res: any) => {
      const nl = JSON.parse(res.data.list);
      this.allFiles = nl;
      this.update();
    });
  }

  public removeDownloadFile(file: FileItem) {
    const index = this.downloadFiles.findIndex((item) => item.CID === file.CID);
    this.downloadFiles.splice(index, 1);
    this.update();
  }

  public downloadFile(file: FileItem) {
    const index =
      this.downloadFiles.push({
        ...file,
        Process: 0,
      }) - 1;

    message.info("开始下载文件：" + file.Name);
    this.update();

    download(
      { ...file, url: module.IpfsModule.gateway() + file.CID },
      ({ savePath, state, isPaused, byte }) => {
        this.downloadFiles[index].Cache = savePath;
        this.update();
        if (state === "interrupted") {
          message.info("文件下载意外中断：" + savePath);
        } else if (state === "progressing") {
          if (isPaused) {
            // console.log("下载暂停");
          } else {
            this.downloadFiles[index].Process =
              byte / (this.downloadFiles[index].Size as number);
            this.update();
          }
        }
      }
    ).then(
      ({ savePath }) => {
        message.success("下次完成：" + savePath);
        // console.log("Download successfully");
        this.downloadFiles[index].Cache = savePath;
        this.downloadFiles[index].Process = 1;
        this.update();
      },
      () => {
        // console.log(`Download failed`);
        this.downloadFiles.splice(index, 1);
        this.update();
      }
    );
  }

  public addUploadFile(data: UploadFileItem) {
    if (this.uploadFiles.some((item) => item.Path === data.Path)) {
      return -1;
    } else {
      const index = this.uploadFiles.push(data);
      this.update();
      return index - 1;
    }
  }

  public updateUploadFile(
    data: Partial<UploadFileItem>,
    index: number,
    upload?: boolean
  ) {
    // console.log(data);
    this.uploadFiles[index] = { ...this.uploadFiles[index], ...data };
    this.update();
    // console.log(this.uploadFiles[index]);
    if (upload) {
      this.uploadFile(index);
    }
  }

  public uploadFile(fileIndex: number) {
    const path = this.uploadFiles[fileIndex].Encrypt
      ? this.uploadFiles[fileIndex].Cache
      : this.uploadFiles[fileIndex].Path;

    // console.log(path);

    ipfs
      .add(path as string, (bt, path) => {
        this.uploadFiles[fileIndex].Process =
          bt / (this.uploadFiles[fileIndex].Size as number);
        this.update();
      })
      .then((res) => {
        this.uploadFiles[fileIndex].Process = 1;
        this.update();
        // @ts-ignore
        return AuthApi.UploadFile({
          ...this.uploadFiles[fileIndex],
          CID: res.cid.toString(),
        }).then(() => {
          this.getList();
        });
      });
  }

  @Update
  private update() {}
}

export default new FileModule();
