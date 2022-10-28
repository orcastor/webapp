import { Login } from "@/api/interface/index";
import { API } from "@/api/config/config";

import http from "@/api";

/**
 * @name 登录模块
 */
// * 用户登录接口
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(API + `/login`, params);
};
