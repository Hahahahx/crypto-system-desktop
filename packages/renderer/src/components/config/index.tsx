import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  LoadingOutlined,
  EditTwoTone,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ReactJson from "react-json-view";
import { TModule } from "types";
import { useModule } from "ux-redux-module";
import { isValidIp } from "../../../../common/util";
const { Paragraph, Text } = Typography;
const { Search } = Input;

export const IpfsConfig = () => {
  const { IpfsModule } = useModule<TModule>();
  const { id, peers, config, repo } = IpfsModule;
  const [host, setHost] = useState(IpfsModule.host);
  const [loading, setLoding] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const connectIpfs = () => {
    if (isValidIp(host)) {
      setLoding(true);
      setDisabled(true);
      IpfsModule.updateHost(host).finally(() => {
        setLoding(false);
      });
    } else {
      message.warning("无效的IP", 1);
    }
  };

  const suffix = () => {
    if (loading) {
      return <LoadingOutlined />;
    }
    if (!disabled) {
      return <EditTwoTone />;
    }
    if (IpfsModule.connected) {
      return <CheckCircleTwoTone twoToneColor="#52c41a" />;
    } else {
      return <CloseCircleTwoTone twoToneColor="#eb2f96" />;
    }
  };

  const list = useMemo(() => {
    return [
      {
        title: "id信息",
        data: id,
      },
      {
        title: "swarm节点信息",
        data: peers,
      },
      {
        title: "repo信息",
        data: repo,
      },
      {
        title: "config信息",
        data: config,
      },
    ];
  }, [id, peers, repo, config]);

  return (
    <div className="flex-start config">
      <div className="desc">
        <Paragraph>
          <Text
            strong
            style={{
              fontSize: 18,
            }}
          >
            <ApartmentOutlined style={{ paddingRight: 5 }} />
            Ipfs配置信息 :
          </Text>
        </Paragraph>
        <Paragraph>
          <Search
            placeholder="请输入连接ip"
            onSearch={connectIpfs}
            enterButton={
              <Button disabled={disabled} type="primary">
                连接
              </Button>
            }
            value={host}
            onChange={(e) => {
              setHost(e.target.value.trim());
              setDisabled(false);
            }}
            suffix={suffix()}
          />
        </Paragraph>
        {list.map((item, i) => (
          <div key={i}>
            <Paragraph>
              <Text
                strong
                style={{
                  fontSize: 14,
                }}
              >
                {item.title}
                {IpfsModule.connected && (
                  <a onClick={() => IpfsModule.getInfo()}> 点击刷新 &gt;</a>
                )}
              </Text>
            </Paragraph>
            <Paragraph className="json">
              <ReactJson src={item.data} enableClipboard={false} name={false} />
            </Paragraph>
          </div>
        ))}
      </div>
    </div>
  );
};
