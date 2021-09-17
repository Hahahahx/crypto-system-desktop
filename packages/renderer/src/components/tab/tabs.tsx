import { Button, Layout, Result, Typography } from "antd";
import React from "react";
import { useEffect } from "react";
import { FC } from "react";
import { SwitcherOutlined } from "@ant-design/icons";
import { Icon } from "..";
import { getComponent } from "./util";
import { useModule } from "ux-redux-module";
import { TModule } from "types";
import { useElectron } from "@/hooks/electron";
const { Paragraph, Text } = Typography;

const { shell, mainPath, isDev, path } = useElectron();

export const Tabs: FC = ({ children }) => {
  const { PageModule } = useModule<TModule>();
  const { page, active } = PageModule;

  useEffect(() => {
    document
      .querySelector("#container")
      ?.addEventListener("wheel", (ev: any) => {
        //   // console.log('sdfsdf')
        ev.currentTarget.scrollLeft += ev.deltaY / 2;
      });
  }, []);

  const onClose = (item: any, i: number) => {
    return (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      PageModule.removePage(i);
    };
  };

  return (
    <Layout className="tabs">
      {!!page.length && (
        <Layout.Header id="container">
          {page.map((item, i) => {
            return (
              <div
                className={`tab-box ${active === i ? "tab-active" : ""}`}
                title={item.name}
                key={i}
                onClick={() => PageModule.setActive(i)}
              >
                <div className="tab">
                  <div className="icon">
                    <Icon type={item.icon} />
                  </div>
                  <div className="name">{item.name}</div>
                  <SwitcherOutlined
                    className="icon"
                    onClick={onClose(item, i)}
                  />
                </div>
              </div>
            );
          })}
        </Layout.Header>
      )}
      <Layout.Content>
        {page.length ? (
          getComponent(page[active].page, page[active].params)
        ) : (
          <Result
            icon={<Icon type="logo" size={100} />}
            title="IPFS Crypt System"
            subTitle="ipfs加密新系统，建立在ipfs分布式系统之上，保证了文件在ipfs系统上的隐私性"
            extra={[
              <Button
                type="primary"
                key="// console"
                onClick={() => {
                  PageModule.addPage({
                    page: "config",
                    icon: "setting",
                    name: "配置",
                  });
                }}
              >
                查看配置
              </Button>,
              <Button
                key="buy"
                onClick={() => {
                  PageModule.addPage({
                    page: "allFile",
                    icon: "allFile",
                    name: "全部文件",
                  });
                }}
              >
                查看文件
              </Button>,
            ]}
          >
            <div className="desc">
              <Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  这里是关于系统的一些介绍:
                </Text>
              </Paragraph>
              <Paragraph>
                如果你还不了解ipfs的话，请点击
                <a
                  onClick={() => {
                    const file = isDev
                      ? "\\buildResources\\introduce.docx"
                      : "\\resources\\introduce.docx";
                    shell.openExternal(mainPath + file);
                  }}
                >
                  《ipfs介绍》 &gt;
                </a>
              </Paragraph>
              <Paragraph>
                如果你想要了解本系统的架构的话，请点击{" "}
                <a
                  onClick={() => {
                    const file = isDev
                      ? "\\buildResources\\design.docx"
                      : "\\resources\\design.docx";
                    shell.openExternal(mainPath + file);
                  }}
                >
                  《ipfs加密系统介绍》 &gt;
                </a>
              </Paragraph>
            </div>
          </Result>
        )}
      </Layout.Content>
    </Layout>
  );
};
