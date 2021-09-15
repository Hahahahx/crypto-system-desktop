import React, { ReactText, useEffect, useState } from "react";
import { Button, Tag, Space, message } from "antd";
import { Icon } from "..";
import { useMouse } from "ahooks";
import { ProfileOutlined } from "@ant-design/icons";
import { UploadBox } from "./upload";
import { useModule } from "ux-redux-module";
import { TModule } from "types";
import { mertic } from "../../../../common/util";
import { useElectron } from "@/hooks/electron";
import { FileItem } from "@/models/FileModule";
import ProList from "@ant-design/pro-list";
import dayjs from "dayjs";

const { clipboard } = useElectron();

export const Files = () => {
  const { FileModule } = useModule<TModule>();
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly ReactText[]>(
    []
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    FileModule.getList();
  }, []);

  const mouse = useMouse();

  const [file, setFile] = useState<File | undefined>();

  return (
    <div
      className="files"
      onDrop={(e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files) {
          setFile(files[0]);
          setVisible(true);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      <UploadBox
        isModalVisible={visible}
        handleClose={() => setVisible(false)}
        file={file}
        setFile={(e?: File) => setFile(e)}
      />
      <ProList<FileItem>
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        rowKey="title"
        showActions="always"
        showExtra="hover"
        headerTitle="全部文件列表"
        toolBarRender={() => {
          return [
            <Button key="3" type="primary" onClick={() => setVisible(true)}>
              上传
            </Button>,
          ];
        }}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
        }}
        dataSource={FileModule.allFiles}
        metas={{
          title: {
            render: (_, entity) => {
              return (
                <div
                  title={`文件名：${entity.Name}\n大小：${mertic(
                    entity.Size
                  )}\nCID：${entity.CID}\n点击可复制CID`}
                  onClick={() => {
                    clipboard.writeText(entity.CID);
                    message.warn({
                      icon: <ProfileOutlined />,
                      content: "已复制CID",
                      className: "custom-class",
                      style: {
                        // marginTop: "20vh",
                        left: mouse.clientX,
                        top: mouse.clientY - 60,
                        position: "fixed",
                      },
                      duration: 1,
                    });
                  }}
                >
                  {entity.Name}
                </div>
              );
            },
          },
          subTitle: {
            render: (_, entity) => {
              return (
                <Space size={0}>
                  {entity.Encrypt && (
                    <Tag
                      color="#108ee9"
                      title="加密文件"
                      icon={<Icon type="cryptFile_sider" />}
                    >
                      Encrypt File
                    </Tag>
                  )}
                  {/* 
                <Tag color="#5BD8A6">Pin</Tag>
                <Tag color="#d85b5b">Not Pin</Tag> */}
                </Space>
              );
            },
          },
          description: {
            render: (_, entity) => (
              <div className="nowrap" style={{ width: "fit-content" }}>
                {entity.CID}
              </div>
            ),
          },
          avatar: {
            render() {
              return <Icon type="dsfs" size={23} />;
            },
          },
          actions: {
            render: (_, entity) => {
              return (
                <Space>
                  <Tag color="blue" title={`文件大小为${mertic(entity.Size)}`}>
                    {mertic(entity.Size)}
                  </Tag>
                  <span>{dayjs(entity.Ctime).format("YY/MM/DD HH:mm")}</span>
                </Space>
              );
            },
          },
          extra: {
            render(_, entity) {
              return (
                <Space style={{ paddingLeft: 10 }}>
                  <a key="invite">预览</a>
                  <a
                    key="invite"
                    onClick={() => {
                      FileModule.downloadFile(entity);
                    }}
                  >
                    下载
                  </a>
                </Space>
              );
            },
          },
        }}
      />
    </div>
  );
};
