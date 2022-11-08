<script setup lang="ts">
import { ref, reactive } from "vue";
import router from "@/routers";
import { Login } from "@/api/interface";
import { loginApi } from "@/api/modules/login";
import { store } from "@/store";
import { ElMessage } from 'element-plus'
// 登录表单数据
const loginForm = reactive<Login.ReqLoginForm>({
  u: "",
  p: "",
});

const loading = ref(false);

const submitForm = async () => {
  loading.value = true;
  try {
      const res = await loginApi(loginForm);
      // 存储 token
      store.setToken(res.data!.access_token);
      store.setUserInfo(res.data!.u);
      store.setBkts(res.data!.b);
      ElMessage({ type: 'success', message: '登录成功' });
      router.push({ name: "home", query: router.currentRoute.value.query });
    } finally {
      loading.value = false;
    }
};
</script>

<template>
  <el-form class='login' v-loading="loading">
    <a href="https://github.com/orcastor" target="_blank">
      <img src="/logo.svg" class="logo" alt="orcas logo" />
    </a>
    <input placeholder="输入用户名" v-model="loginForm.u">
    <input type="password" placeholder="输入密码" v-model="loginForm.p">
    <button type="submit" @click="submitForm()">登录</button>
  </el-form>
</template>

<style scoped>
:root {
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #fff;
}

.login {
  max-width: 300px;
  margin: auto;
  flex: 1;
  text-align: center;
}

.login button, .login input {
  width: 100%;
  border-radius: 6px;
  border: 1px solid transparent;
  margin: 16px 0;
  padding: 0.6em 3.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.25s;
  display: block;
  box-sizing: border-box;
  will-change: filter;
  color: #ccc;
}
.login button, .login input {
  background-color: #1a1a1a;
}
.login button:focus,
.login button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

.logo {
  height: 6em;
  will-change: filter;
}
.logo:hover, .login button:hover, .login input:hover {
  color: #aaa;
  filter: drop-shadow(0 0 2px #888);
}
</style>
