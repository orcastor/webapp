// * 请求响应参数(不包含data)
export interface Result {
  code: string;
  msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
  data?: T;
}

// * 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    access_token: string;
    user: any;
    bkts: any;
  }
}

export namespace List {
  export interface ListOption {
    // w: string;
    // d: string;
    // t: number;
    c: number;
    // o: string;
    b: number;
  }
  export interface ReqList {
    p: number;
    b: number;
    o: ListOption;
  }
  export interface ObjectInfo {
    id: number;
    pid: number;
    mtime: number;
    did: number;
    type: number;
    name: string;
    size: number;
    ext: any;
  }
  export interface ResList {
    o: ObjectInfo[];
  }
}
