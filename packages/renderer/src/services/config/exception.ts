import { notification } from "antd";

export class Exception {

    public code: number
    public msg: string

    public constructor(code: number, msg: string) {
        this.code = code;
        this.msg = msg;
    }

    public handle() {
        // switch (this.code) {
        //     case 2000:
        //         notification.warn({
        //             message: `登录异常`,
        //             description:
        //                 '登录检测已退出，请重新登录！'
        //         })
        //         window.location.href = '/'
        //         break
        //     default:
        //         ;
        // }
    }

}