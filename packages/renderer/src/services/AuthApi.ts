import { request } from "./config/request";

class AuthApi {
  public GetList(): Promise<any> {
    return request.get("/auth/list");
  }
  public VerifyFile(params: { md5: string }): Promise<any> {
    return request.get("/auth/verify", params);
  }

  public GetKMSkey(): Promise<any> {
    return request.get("/auth/key");
  }

  public DecryptFileKey(params: {
    publicKey: string;
    cid: string;
  }): Promise<any> {
    return request.post("/auth/decrypt", params);
  }

  public UploadFile(params: {
    CID: string;
    Key: string;
    MD5: string;
    Name: string;
    Encrypt: boolean;
    Size: string
  }): Promise<any> {
    return request.post("/auth/upload", params);
  }
}

export default new AuthApi();
