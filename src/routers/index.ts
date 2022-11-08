import router from "@/routers/router";
import { store } from "@/store";

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach((to:any, from:any, next:any) => {
  // * 判断当前路由是否需要访问权限
  if (to.matched.some((record:any) => record.meta.requiresAuth)) {
    // * 判断是否有Token
    if (!store.token) {
      next({ name: "login", query: from.query });
      return;
    }
  }

  return next();
});

export default router;
