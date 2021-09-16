import { Header, Icon } from "@/components";
import { useElectron } from "@/hooks/electron";
import { PoweroffOutlined, LayoutOutlined } from "@ant-design/icons";
import { Card, Col, Layout, Menu, Row, Space } from "antd";
import React from "react";

const {
  browserWindow: { appQuit, toggleMainWindow, windowClose },
} = useElectron();

const IMenu = () => {
  const handleClick = (e: any) => {
    console.log("click ", e);
  };

  return (
    <div className="tray">
      <Card
        title={
          <Row>
            <Space>
              <Icon type="logo" size={18} />
              <div> IPFS-Crypto-System</div>
            </Space>
          </Row>
        }
        bordered={false}
        bodyStyle={{ background: "rgba(0,0,0,.1)" }}
      >
        <p>ipfs加密新系统，建立在ipfs分布式系统之上，</p>
        <p>保证了文件在ipfs系统上的隐私性</p>
      </Card>
      <Menu onClick={handleClick} selectable={false} style={{ marginTop: 20 }}>
        {/* <Menu.ItemGroup key="g1" title="文件">
          <Menu.Item key="1">上传</Menu.Item>
          <Menu.Item key="2">下载</Menu.Item>
        </Menu.ItemGroup> */}
        <Menu.ItemGroup key="g2" title="系统">
          <Menu.Item
            key="3"
            icon={<LayoutOutlined />}
            onClick={() => {
              toggleMainWindow();
              // windowClose();
            }}
          >
            关闭/打开主页面
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<PoweroffOutlined style={{ color: "red" }} />}
            onClick={() => appQuit()}
          >
            退出
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    </div>
  );
};

export default IMenu;
