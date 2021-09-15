import React from "react";
import { Layout, Menu } from "antd";
import { Icon } from "..";
import { useModule } from "ux-redux-module";
import { TModule } from "types";
const { Sider: AntdSider } = Layout;

export const Sider = () => {
  const { PageModule } = useModule<TModule>();

  const handleClick = (e: any) => {
    switch (e.key) {
      case "config":
        PageModule.addPage({
          page: e.key,
          icon: "setting",
          name: "配置",
        });
        break;
      case "allFile":
        PageModule.addPage({
          page: e.key,
          icon: "allFile",
          name: "全部文件",
        });
        break;
      case "uploadFile":
        PageModule.addPage({
          page: e.key,
          icon: "upload",
          name: "上传列表",
        });
        break;
      case "downloadFile":
        PageModule.addPage({
          page: e.key,
          icon: "download",
          name: "下载列表",
        });
        break;
    }
  };

  return (
    <div className="sider">
      <AntdSider>
        <Menu onClick={handleClick} selectable={false}>
          <Menu.ItemGroup
            key="g1"
            title={
              <div className="flex-start">
                <div>IPFS</div>
              </div>
            }
          >
            <Menu.Item key="config">
              <div className="flex-start">
                <Icon className="icon" type="setting_sider" />
                <div>配置</div>
              </div>
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup
            key="g2"
            title={
              <div className="flex-start">
                {/* <Icon style={{ paddingRight: 10 }}  type="ipfs-crypt-file_show" /> */}
                <div>FILE</div>
              </div>
            }
          >
            <Menu.Item key="allFile">
              <div className="flex-start">
                <Icon className="icon" type="allFile_sider" />
                <div>全部</div>
              </div>
            </Menu.Item>
            <Menu.Item key="cryptFile">
              <div className="flex-start">
                <Icon className="icon" type="cryptFile_sider" />
                <div>加密</div>
              </div>
            </Menu.Item>
            <Menu.Item key="rawFile">
              <div className="flex-start">
                <Icon className="icon" type="rawFile_sider" />
                <div>普通</div>
              </div>
            </Menu.Item>
            <Menu.Item key="downloadFile">
              <div className="flex-start">
                <Icon className="icon" type="download_sider" />
                <div>下载</div>
              </div>
            </Menu.Item>
            <Menu.Item key="uploadFile">
              <div className="flex-start">
                <Icon className="icon" type="upload_sider" />
                <div>上传</div>
              </div>
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </AntdSider>
      <div className="drag-box"></div>
    </div>
  );
};
