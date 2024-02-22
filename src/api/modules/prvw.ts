import { Object, Preview } from "@/api/interface/index";
import { PRVW_API } from "@/api/config/config";

import http from "@/api";

export const prvwListApi = (params: Object.ReqList) => {
  return http.post<Preview.ResList>(PRVW_API + `/list`, params);
};
