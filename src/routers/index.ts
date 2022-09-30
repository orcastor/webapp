import router from "@/routers/router";
import NProgress from "@/config/nprogress";
import { GlobalStore } from "@/store";

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach((to:any, from:any, next:any) => {
  NProgress.start();

  // * 判断当前路由是否需要访问权限
  if (!to.matched.some((record:any) => record.meta.requiresAuth)) return next();

  // * 判断是否有Token
  const globalStore = GlobalStore();
  if (!globalStore.token) {
    next({
      path: "/login",
    });
    NProgress.done();
    return;
  }

  return next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
