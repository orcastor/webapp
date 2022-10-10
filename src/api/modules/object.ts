import { Object } from "@/api/interface/index";
import { PORT1 } from "@/api/config/config";

import http from "@/api";

export const listApi = (params: Object.ReqList) => {
  return http.post<Object.ResList>(PORT1 + `/list`, params);
};

export const getApi = (params: Object.ReqGet) => {
  return http.post<Object.ResGet>(PORT1 + `/get`, params);
};
