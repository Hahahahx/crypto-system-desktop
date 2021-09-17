import Axios, { AxiosRequestConfig } from "axios";

/**
 * @File: axiosConfig.ts
 * @Author: Ux
 * @Date: 2020/7/28
 * @Description: 统一配置
 */
let connect = true;
export const instance = Axios.create();

instance.defaults.withCredentials = true;
instance.defaults.baseURL = "http://192.168.50.219:9090";
// instance.defaults.timeout = 5000;
// instance.interceptors.request.use((config: AxiosRequestConfig) => {
//   // console.log(config.baseURL);
//   // console.log(config.url);
//   // config.headers = { "Content-Type": "application/json" };
//   return config;
// });

instance.interceptors.response.use(
  (res) => {
    if (!connect) {
      connect = true;
    }
    // if (res.data.code !== 0) {
    //   new Exception(res.data.code, res.data.msg).handle();
    // }
    return res.data;
  },
  (rej) => {
    return rej;
    // // console.log(rej);
    // if (connect) {
    //   connect = false;
    // }
  }
);
