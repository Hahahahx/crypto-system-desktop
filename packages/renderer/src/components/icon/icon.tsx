import React from "react";
import ipfsLogo from "@assets/ipfs-logo.svg";
import IconFonts from "./iconfont";

interface IconStr {
  [key: string]: string | { src: string };
}

const icon: IconStr = {
  unknow: "ipfs-crypt-unknow",
  setting: "ipfs-crypt-setting2",
  setting_sider: "ipfs-crypt-setting",
  allFile: "ipfs-crypt-other",
  allFile_sider: "ipfs-crypt-file_all",
  cryptFile: "ipfs-crypt-unlock",
  cryptFile_sider: "ipfs-crypt-lock",
  rawFile: "ipfs-crypt-file",
  rawFile_sider: "ipfs-crypt-file_show",
  min: "ipfs-crypt-min",
  max: "ipfs-crypt-max",
  restore: "ipfs-crypt-restore",
  quit: "ipfs-crypt-quit",
  download_sider: "ipfs-crypt-download",
  download: "ipfs-crypt-xiazai",
  upload_sider: "ipfs-crypt-upload",
  upload: "ipfs-crypt-shangchuan",
  upload_drag: "ipfs-crypt-shangchuanwenjian",
  ipfs: {
    src: ipfsLogo,
  },
};

interface IconParams {
  type: string;
  size?: number;
  [k: string]: any;
}

const Icon = (params: IconParams) => {
  const param: any = { ...params };

  switch (typeof icon[param.type]) {
    case "undefined":
      param.type = "unknow";
    // eslint-disable-next-line no-fallthrough
    case "string":
      param.type = icon[param.type] as string;
      if (param.size) {
        param.style = { fontSize: param.size };
      }
      return <IconFonts {...param} />;

    case "object": {
      param.src = (icon[param.type] as any).src;
      if (param.size) {
        param.width = `${param.size}px`;
      }
      return <img {...param} />;
    }
  }
};

export default Icon;
