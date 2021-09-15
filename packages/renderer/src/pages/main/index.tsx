import { Footer, Header, Sider, Tabs } from "@components/index";
import { Layout } from "antd";
import React from "react";

const Main = () => {
  return (
    <>
      <Layout className="wh-100">
        <Header />
        <Layout>
          <Sider></Sider>
          <Layout.Content>
            <Tabs></Tabs>
          </Layout.Content>
        </Layout>
        <Footer />
      </Layout>
    </>
  );
};

export default Main;
