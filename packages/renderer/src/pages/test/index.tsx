import { Header } from "@/components";
import { Layout } from "antd";
import React from "react";

const Test = () => {
  return (
    <Layout className="layout">
      <Header isModal={true} />
      <Layout>
        <Layout.Content>testPage this page is Modal</Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Test;
