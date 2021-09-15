import { CID, create, IPFSHTTPClient } from "ipfs-http-client";
import { createReadStream } from "fs";
import { mertic } from "../../../common/util";

/**
 *
 * 在渲染进程中，很多ipfs定义的类无法使用
 * 所以不得不使用这样的方式对ipfs进行处理，
 * 这样会会一些繁琐，但目前还没有更好的解决方案
 *
 */

let ipfs: IPFSHTTPClient;

const connect = (
  url: string
): Promise<{
  addresses: string[];
  id: string;
  publicKey: string;
  agentVersion: string;
  protocolVersion: string;
  protocols: string[];
}> => {
  ipfs = create({
    url,
  });
  return id();
};

const id = () => {
  return ipfs.id().then((res) => {
    return {
      ...res,
      addresses: res.addresses.map((item) => item.toString()),
    };
  });
};

const repo = {
  stat: () => {
    return ipfs.repo.stat().then((res) => {
      return {
        ...res,
        storageMax: mertic(res.storageMax.toString()),
        numObjects: mertic(res.numObjects.toString()),
        repoSize: mertic(res.repoSize.toString()),
      };
    });
  },
};

const config = {
  show: () => {
    return ipfs.config.getAll();
  },
};

const swarm = {
  peers: () => {
    return ipfs.swarm.peers().then((res) => {
      return res.map((item) => ({ ...item, addr: item.addr.toString() }));
    });
  },
};

const add = (
  path: string,
  progress: (bt: number, path?: string) => void
): Promise<{
  cid: string;
  size: number;
  path: string;
  mode?: number;
}> => {
  const content = createReadStream(path);
  return ipfs.add({ content }, { progress }).then((res) => {
    return {
      ...res,
      cid: res.cid.toString(),
    };
  });
};

export { connect, id, add, repo, config, swarm };
