import { Notify } from 'vant';
import 'vant/es/notify/style';

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number): void => {
  switch (status) {
    case 400:
      Notify({ type: 'warning', message: "请求失败！请您稍后重试" });
      break;
    case 401:
      Notify({ type: 'warning', message: "登录失效！请您重新登录" });
      break;
    case 403:
      Notify({ type: 'warning', message: "当前账号无权限访问！" });
      break;
    case 404:
      Notify({ type: 'warning', message: "你所访问的资源不存在！" });
      break;
    case 405:
      Notify({ type: 'warning', message: "请求方式错误！请您稍后重试" });
      break;
    case 408:
      Notify({ type: 'warning', message: "请求超时！请您稍后重试" });
      break;
    case 500:
      Notify({ type: 'warning', message: "服务异常！" });
      break;
    case 502:
      Notify({ type: 'warning', message: "网关错误！" });
      break;
    case 503:
      Notify({ type: 'warning', message: "服务不可用！" });
      break;
    case 504:
      Notify({ type: 'warning', message: "网关超时！" });
      break;
    default:
      Notify({ type: 'warning', message: "请求失败！" });
  }
};
