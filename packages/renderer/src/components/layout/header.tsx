import React, { FC, useState } from "react";
import { Layout } from "antd";
import { Icon } from "..";
import { useElectron } from "@hooks/electron";
const { Header: AntdHeader } = Layout;
const { windowMin, windowMax, windowClose } = useElectron();

export const Header: FC<{ isModal?: boolean }> = (params) => {
  return (
    <AntdHeader className="header drag-header">
      <div className="icon">
        <span />
      </div>
      <p className="title">Electron-start</p>
      <div className="opt">
        <OptBtn {...params} />
      </div>
    </AntdHeader>
  );
};

const OptBtn: FC<{ isModal?: boolean }> = ({ isModal }) => {
  const [maxIcon, setMaxIcon] = useState("max");

  const handleMin = () => {
    windowMin();
  };

  const handleMax = () => {
    windowMax().then((res: any) => {
      console.log(res);
      if (res.args.result) {
        setMaxIcon("restore");
      } else {
        setMaxIcon("max");
      }
    });
  };

  const handleQuit = () => {
    windowClose();
  };

  return (
    <>
      {!isModal && (
        <>
          <button className="min" onClick={handleMin}>
            <Icon type="min" />
          </button>
          <button className="max" onClick={handleMax}>
            <Icon type={maxIcon} />
          </button>
        </>
      )}
      <button className="quit" onClick={handleQuit}>
        <Icon type="quit" />
      </button>
    </>
  );
};
