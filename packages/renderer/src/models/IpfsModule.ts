import { useElectron } from "@/hooks/electron";
import { LocalStorage, Update } from "ux-redux-module";

const { ipfs } = useElectron();
class IpfsModule {
  public connected = false;

  @LocalStorage
  public host = "192.168.50.219";

  public id = {};
  public peers = {};
  public repo = {};
  public config = {};

  constructor() {
    this.connect();
  }

  public connect() {
    return ipfs.connect(this.api()).then(
      () => {
        this.connected = true;
        this.update();
      },
      () => {
        this.connected = false;
        this.update();
      }
    );
  }

  public getInfo() {
    ipfs
      .id()
      .then((res) => {
        this.id = res;
        this.update();
        return ipfs.swarm.peers();
      })
      .then((res) => {
        this.peers = res;
        this.update();
        return ipfs.repo.stat();
      })
      .then((res) => {
        this.repo = res;
        this.update();
        return ipfs.config.show();
      })
      .then((res) => {
        this.config = res;
        this.update();
      });
  }

  public gateway() {
    return `http://${this.host}:8080/ipfs/`; // ipfs网关端口
  }

  public api() {
    return `/ip4/${this.host}/tcp/5001`; // ipfs通讯端口
  }

  public updateHost(host: string) {
    this.host = host;
    this.update();
    return this.connect();
  }

  @Update
  private update() {}
}

export default new IpfsModule();
