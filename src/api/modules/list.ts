import { List } from "@/api/interface/index";
import { PORT1 } from "@/api/config/config";

import http from "@/api";

export const listApi = (params: List.ReqList) => {
  return http.post<List.ResList>(PORT1 + `/list`, params); // 正常 post json 请求  ==>  application/json
};
