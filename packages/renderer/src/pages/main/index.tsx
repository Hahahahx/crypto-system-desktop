import { Header } from "@/components";
import { useElectron } from "@/hooks/electron";
import { Button, Layout } from "antd";
import React from "react";

const Main = () => {
  const { getModal } = useElectron();
  return (
    <>
      <Layout className="layout">
        <Header></Header>
        <Layout>
          <Layout.Content>
            <Button
              onClick={() => {
                getModal("test");
              }}
            >
              openModal
            </Button>
          </Layout.Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Main;
