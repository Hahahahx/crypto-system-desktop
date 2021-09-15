import { join } from "path";
import { exec } from "child_process";
import { Crypto } from "../../../common/IpcEvent";
import { IpcMainEvent } from "electron";
import { isDevMode } from "../utils";

const exe = isDevMode
  ? join(__dirname, "..", "src", "crypt.exe")
  : join(process.cwd(), "crypt.exe");

export function initCrypt(): void {
  console.log(exe);
  exec(`${exe} init`);
}

function execCrypt(command: string): Promise<any> {
  return new Promise((res, rej) => {
    exec(`${exe} ${command}`, (err: any, stdout: any, stderr: any) => {
      if (err) {
        rej(stderr);
      }
      const result = JSON.parse(stdout);
      if (result.result) {
        res(result);
      } else {
        rej(stdout);
      }
    });
  });
}

export class CryptoChannel implements IpcChannelInterface {
  command: (opt: any) => string;
  type: Crypto;
  constructor(v: Crypto, command: (opt: any) => string) {
    this.type = v;
    this.command = command;
  }

  handle(event: IpcMainEvent, request?: IpcRequest): void {
    execCrypt(this.command(request?.params)).then(
      (res) => {
        event.reply(this.type, res);
      },
      (rej) => {
        event.reply(this.type, rej);
      }
    );
  }
}
