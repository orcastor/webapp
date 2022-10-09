import { defineStore, createPinia } from "pinia";
import { GlobalState, MenuState } from "./interface";
import piniaPersistConfig from "@/config/piniaPersist";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const GlobalStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: "GlobalState",
  // state: 返回对象的函数
  state: (): GlobalState => ({
    // token
    token: "",
    // userInfo
    userInfo: "",
    // buckets
    bkts: "",
  }),
  getters: {},
  actions: {
    // setToken
    setToken(token: string) {
      this.token = token;
    },
    // setUserInfo
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo;
    },
    // setBkts
    setBkts(bkts: any) {
      this.bkts = bkts;
    },
  },
  persist: piniaPersistConfig("GlobalState"),
});

// MenuStore
export const MenuStore = defineStore({
  id: "MenuState",
  state: (): MenuState => ({
    // menu collapse
    isCollapse: false,
    breadcrumbs: [],
  }),
  getters: {},
  actions: {
    async setCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
  persist: piniaPersistConfig("MenuState"),
});

// piniaPersist(持久化)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
