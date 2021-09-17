/* eslint-disable */
import { Response } from "./response";
import { Exception } from "./exception";
import { instance } from "./config";

interface Params {
  [name: string]: any;
}

interface FileName {
  name: string;
  ext: string;
}

export class request {
  // 对象转换URL拼接字符串
  static formateObjToParamStr(params: Params) {
    const sdata = [];
    for (let key in params) {
      sdata.push(`${key}=${this.filter(params[key])}`);
    }
    return sdata.join("&");
  }

  // 特殊字符转义
  static filter(str: string) {
    str = String(str); // 隐式转换
    str = str.replace(/%/g, "%25");
    str = str.replace(/\+/g, "%2B");
    str = str.replace(/ /g, "%20");
    str = str.replace(/\//g, "%2F");
    str = str.replace(/\?/g, "%3F");
    str = str.replace(/&/g, "%26");
    str = str.replace(/\=/g, "%3D");
    str = str.replace(/#/g, "%23");
    return str;
  }

  static get(url: string, params?: Params): Promise<Response<any>> {
    url += params ? "?" + request.formateObjToParamStr(params) : "";
    return instance.get(url);
  }

  static post(url: string, params: Params): Promise<Response<any>> {
    const fd = new FormData();
    for (const key in params) {
      fd.append(key, params[key]);
    }
    return instance.post(url, fd);
  }

  // static download(url: string, filename?: string, params?: Params) {
  //   url += params ? "?" + request.formateObjToParamStr(params) : "";
  //   // const a = document.createElement('a');
  //   // a.href = 'http://test.pan.com:9501' + url;
  //   // a.click();
  //   // stream下载 跨域问题
  //   return instance.get(url, { responseType: "blob" }).then(
  //     (res) => {
  //       if (!res) {
  //         // console.error("下载文件失败");
  //         return res;
  //       }
  //       // @ts-ignore
  //       const blob = new Blob([res], {
  //         type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //       });
  //       const a = document.createElement("a");
  //       const url = window.URL.createObjectURL(blob);
  //       a.href = url;
  //       a.download = `${filename || "log"}`;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     },
  //     (rej) => {
  //       return rej;
  //     }
  //   );
  // }
}
