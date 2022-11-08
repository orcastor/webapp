class GlobalStore {
  // token
  token: string;
  // userInfo
  userInfo: any;
  // buckets
  bkts: any;
  // is menu collapsed
  isCollapse: boolean;

  constructor() {
    this.token = localStorage.getItem('token')||'';
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')||'{}');
    this.bkts = JSON.parse(localStorage.getItem('bkts')||'{}');
    this.isCollapse = JSON.parse(localStorage.getItem('isCollapse')||'false');
  }

  // setToken
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }
  // setUserInfo
  setUserInfo(userInfo: any) {
    this.userInfo = userInfo;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }
  // setBkts
  setBkts(bkts: any) {
    this.bkts = bkts;
    localStorage.setItem('bkts', JSON.stringify(bkts));
  }
  async setCollapse() {
    this.isCollapse = !this.isCollapse;
    localStorage.setItem('isCollapse', JSON.stringify(this.isCollapse));
  }
};

export const store:GlobalStore = new GlobalStore;
