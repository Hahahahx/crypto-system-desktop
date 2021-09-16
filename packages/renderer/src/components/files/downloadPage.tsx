import React, { useEffect, useState } from "react";
import { Tag, Space, Progress, Button, message } from "antd";
import ProList from "@ant-design/pro-list";
import { Icon } from "..";
import { useModule } from "ux-redux-module";
import { useElectron } from "@/hooks/electron";
import { TModule } from "types";
import { DownloadFileItem } from "@/models/FileModule";
import { Crypto } from "@common/IpcEvent";
import { mertic } from "@common/util";

const { fs, shell, dialog, handleIpcRenderer } = useElectron();

export const DownloadFiles = () => {
  const { FileModule } = useModule<TModule>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    FileModule.getList();
  }, []);

  return (
    <div className="upload-files">
      <ProList<DownloadFileItem>
        rowKey="title"
        headerTitle="下载列表"
        dataSource={FileModule.downloadFiles}
        metas={{
          title: {
            render: (_, entity) => {
              return (
                <div
                  onClick={() => {
                    const exist = fs.existsSync(entity.Cache as string);
                    if (!exist) {
                      message.warn("文件源已经丢失！");
                      FileModule.removeDownloadFile(entity as any);
                      return;
                    }
                    shell.openExternal(entity.Cache as string);
                  }}
                  title={`文件名：${entity.Name}\n大小：${mertic(
                    entity.Size
                  )}\n点击打开文件所在目录`}
                >
                  {entity.Name}
                </div>
              );
            },
          },
          subTitle: {
            render: (_, entity) => {
              return (
                <Space>
                  {entity.Encrypt && <Tag color="blue">Encrypt File</Tag>}
                </Space>
              );
            },
          },
          avatar: {
            render() {
              return <Icon type="dsfs" size={23} />;
            },
          },
          actions: {
            render: (_, entity) => {
              return (
                <>
                  {entity.Process !== 1 && (
                    <div
                      style={{
                        width: "200px",
                      }}
                    >
                      <Progress
                        strokeColor={{
                          from: "#108ee9",
                          to: "#87d068",
                        }}
                        status="active"
                        percent={Number((entity.Process * 100).toFixed(2))}
                      />
                    </div>
                  )}
                  {entity.Process === 1 && (
                    <Space>
                      {entity.Encrypt ? (
                        <Button
                          type="link"
                          key="invite"
                          loading={loading}
                          onClick={() => {
                            setLoading(true);
                            const exist = fs.existsSync(entity.Cache as string);

                            if (!exist) {
                              message.warn("文件源已经丢失！");
                              FileModule.removeDownloadFile(entity as any);
                              setLoading(false);
                              return;
                            }
                            dialog
                              .showSaveDialogSync({
                                defaultPath: entity.Name,
                              })
                              .then((res) => {
                                const path = res.args.path;
                                handleIpcRenderer(Crypto.Decrypt, {
                                  name: path,
                                  key: entity.Key,
                                  file: entity.Cache,
                                }).then((res) => {
                                  message.success("文件解密到：" + path);
                                  setLoading(false);
                                });
                              });
                          }}
                        >
                          解密
                        </Button>
                      ) : (
                        <a
                          key="invite"
                          onClick={() => {
                            shell.openExternal(entity.Cache as string);
                          }}
                        >
                          查看
                        </a>
                      )}
                    </Space>
                  )}
                </>
              );
            },
          },
        }}
      />
    </div>
  );
};
