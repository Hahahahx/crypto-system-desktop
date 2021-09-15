enum WindowOpt {
  Window = "CreateWindow",
  ChildWindow = "CreateChildWindow",
  Modal = "Modal",
  Max = "Max",
  Min = "Min",
  Close = "Close",
  Current = "Current",
}

enum Dialog {
  Save = "Save",
}

enum Crypto {
  Init = "Init",
  Md5 = "Md5",
  Encrypt = "Encrypt",
  Decrypt = "Decrypt",
}

enum File {
  Download = "Download",
}

export { WindowOpt, Crypto, File, Dialog };
