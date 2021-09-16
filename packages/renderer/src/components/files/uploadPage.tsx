import React, { ReactText, useEffect, useState } from "react";
import { Tag, Space, Progress } from "antd";
import ProList from "@ant-design/pro-list";
import { Icon } from "..";
import { useModule } from "ux-redux-module";
import { UploadFileItem } from "@/models/FileModule";
import { mertic } from "@common/util";
import { useElectron } from "@/hooks/electron";
import { TModule } from "types";

const { path, shell } = useElectron();

export const UploadFiles = () => {
  const { FileModule } = useModule<TModule>();

  useEffect(() => {
    FileModule.getList();
  }, []);

  return (
    <div className="upload-files">
      <ProList<UploadFileItem>
        rowKey="title"
        headerTitle="上传列表"
        dataSource={FileModule.uploadFiles}
        metas={{
          title: {
            render: (_, entity) => {
              return (
                <div
                  onClick={() => {
                    shell.openExternal(path.dirname(entity.Path));
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
              );
            },
          },
        }}
      />
    </div>
  );
};
