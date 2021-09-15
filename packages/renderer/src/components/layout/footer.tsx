import React from "react";
import { Layout, Space } from "antd";
import { ApiOutlined, BellOutlined } from "@ant-design/icons";
import { useModule } from "ux-redux-module";
import { TModule } from "types";
const { Footer: AntdFooter } = Layout;
export const Footer = () => {
  const { IpfsModule } = useModule<TModule>();

  return (
    <AntdFooter className="footer">
      <Space
        className={`connector ${IpfsModule.connected ? "success" : "failure"}`}
        title={`ipfs连接节点：${IpfsModule.host}\n连接状态： ${
          IpfsModule.connected ? "成功" : "失败"
        }`}
      >
        <ApiOutlined />
        <div>{IpfsModule.host}</div>
      </Space>
      <div className="info">金钱猫科技股份有限公司 · ux</div>
      <div className="opt">
        <BellOutlined className="log" />
      </div>
    </AntdFooter>
  );
};
