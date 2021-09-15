import { useElectron } from "@/hooks/electron";
import { Button, message, Modal, Result } from "antd";
import React from "react";
import { TModule } from "types";
import { useModule } from "ux-redux-module";
import { Icon } from "..";
import { Crypto } from "../../../../common/IpcEvent";
import { mertic } from "../../../../common/util";

interface UploadBoxParams {
  isModalVisible: boolean;
  handleClose: () => any;
  file?: File;
  setFile: (e?: File) => any;
}

const { handleIpcRenderer, path } = useElectron();

export const UploadBox = ({
  isModalVisible,
  handleClose,
  setFile,
  file,
}: UploadBoxParams) => {
  const { IpfsModule, FileModule } = useModule<TModule>();

  const addUploadFile = () => {
    return FileModule.addUploadFile({
      Name: file?.name,
      Size: file?.size,
      Process: 0,
      Path: file?.path as string,
    });
  };

  const handleMd5 = (res: any, index: number, encrypt: boolean) => {
    res = res.args.data;
    if (res.hasFile) {
      FileModule.updateUploadFile(
        {
          Process: 1,
          CID: res.CID,
          Encrypt: encrypt,
          MD5: res.md5,
        },
        index
      );
    } else {
      FileModule.updateUploadFile({ Encrypt: encrypt, MD5: res.md5 }, index);
      if (encrypt) {
        message.warn("已添加到上传队列");
        return handleIpcRenderer(Crypto.Encrypt, { file: file?.path });
      } else {
        FileModule.updateUploadFile({ MD5: res.md5 }, index, true);
      }
    }
    message.warn("已添加到上传队列");

    return;
  };

  const handleUpload = () => {
    const index = addUploadFile();
    if (index === -1) {
      message.warn("文件已在上传队列中！");
    } else {
      handleIpcRenderer(Crypto.Md5, { file: file?.path }).then((res: any) => {
        handleMd5(res, index, false);
      });
    }
    setFile();
    handleClose();
  };

  const handleEncryptUpload = () => {
    const index = addUploadFile();
    if (index === -1) {
      message.warn("文件已在上传队列中！");
    } else {
      handleIpcRenderer(Crypto.Md5, { file: file?.path }).then((res) => {
        const encrypt = handleMd5(res, index, true);
        if (encrypt) {
          encrypt.then((encryptRes: any) => {
            encryptRes = encryptRes.args.data;
            FileModule.updateUploadFile(
              {
                Key: encryptRes.key,
                Cache: encryptRes.filepath,
              },
              index,
              true
            );
          });
        }
      });
    }
    setFile();
    handleClose();
  };

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files) {
          setFile(files[0]);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      <Modal
        className="upload"
        title="上传文件"
        visible={isModalVisible}
        onCancel={handleClose}
        footer={[
          <Button
            key="selectfile"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.click();
              input.onchange = (e: any) => {
                setFile(e.target.files[0]);
                console.log(e.target.files[0]);
              };
            }}
          >
            选择文件
          </Button>,
          file ? (
            <Button type="primary" key="upload" onClick={handleUpload}>
              上传
            </Button>
          ) : null,
          file ? (
            <Button
              type="primary"
              key="encryptUpload"
              onClick={handleEncryptUpload}
            >
              加密上传
            </Button>
          ) : null,
        ]}
      >
        {file ? (
          <div className="flex-center flex-verital">
            <div className="icon">
              <Icon type={path.extname(file?.path)} size={50} />
            </div>
            <div className="filename" style={{ textAlign: "center" }}>
              {file?.path}
            </div>
            <div className="filesize">{mertic(file?.size)}</div>
          </div>
        ) : (
          <Result
            icon={<Icon type="upload_drag" />}
            title="你可以拖动文件到这里，也可以点击下方的选择文件"
          />
        )}
      </Modal>
    </div>
  );
};
