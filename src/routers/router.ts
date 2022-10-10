import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

/**
 * @description 路由配置简介（💢没有使用动态路由，路由全部配置在本地，需要使用动态路由请自行改造）
 * @param path ==> 路由路径
 * @param name ==> 路由名称
 * @param redirect ==> 路由重定向
 * @param component ==> 路由组件
 * @param meta ==> 路由元信息
 * @param meta.requireAuth ==> 是否需要权限验证
 * @param meta.keepAlive ==> 是否需要缓存该路由
 * @param meta.title ==> 路由标题
 * @param meta.key	==> 路由key,用来匹配按钮权限
 * */
const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: {
      requiresAuth: false,
      title: "登录页",
      key: "login",
    },
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
    meta: {
      keepAlive: true,
      requiresAuth: true,
      title: "首页",
      key: "home",
    },
  },
  {
    // 找不到路由重定向到404页面
    path: "/:pathMatch(.*)",
    redirect: { name: "404" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  strict: false,
  // 切换页面，滚动到最顶部
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
