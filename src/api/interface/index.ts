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
    u: string; // username
    p: string; // password
  }
  export interface ResLogin {
    access_token: string;
    u: any; // user
    b: any; // bkts
  }
}

export namespace Object {
  export interface ReqList {
    p: number;
    b: number;
    w?: string;
    d?: string;
    t?: number;
    c: number;
    o?: string;
    e?: number;
  }
  export interface ObjectInfo {
    i: number; // id
    p?: number; // pid
    m: number; // mtime
    d?: number; // did
    t: number; // type
    n: string; // name
    s?: number; //size
    e?: any; // ext
  }
  export interface ResList {
    o?: ObjectInfo[];
  }
  export interface ReqGet {
    b: number;
    i: number;
  }
  export interface ResGet {
    o?: ObjectInfo;
  }
}

export namespace Preview {
  export interface ObjectInfo {
    m: number; // mtime
    t: number; // type
    n?: string; // name
    s?: number; //size
  }
  export interface ResList {
    o?: ObjectInfo[];
  }
  export interface ReqGet {
    b: number;
    i: number;
  }
  export interface ResGet {
    o?: ObjectInfo;
  }
}
