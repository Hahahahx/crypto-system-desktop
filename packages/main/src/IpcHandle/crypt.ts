import { join } from "path";
import { execFile } from "child_process";
import { Crypto } from "../../../common/IpcEvent";
import { app, IpcMainEvent } from "electron";
import { isDevMode } from "../utils";

const exe = isDevMode
  ? join(__dirname, "..", "src", "crypt.exe")
  : join(process.cwd(), "resources", "crypt.exe");

console.log(exe);

export function initCrypt(): void {
  console.log(exe);
  execFile(exe, ["init"]);
}

function execCrypt(command: string[]): Promise<any> {
  return new Promise((res, rej) => {
    execFile(exe, command, (err: any, stdout: any, stderr: any) => {
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
  command: (opt: any) => string[];
  type: Crypto;
  constructor(v: Crypto, command: (opt: any) => string[]) {
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
