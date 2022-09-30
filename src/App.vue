<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Login } from "@/api/interface";
import { loginApi } from "@/api/modules/login";
import { GlobalStore } from "@/store";
import { Notify } from 'vant';
import 'vant/es/notify/style';
// 登录表单数据
const loginForm = reactive<Login.ReqLoginForm>({
  username: "",
  password: "",
});

const globalStore = GlobalStore();
const loading = ref(false);
const onSubmit = async () => {
  loading.value = true;
  try {
      const res = await loginApi(loginForm);
      // 存储 token
      globalStore.setToken(res.data!.access_token);
      globalStore.setUserInfo(res.data!.user);
      Notify({ type: 'success', message: '登录成功' });
    } finally {
      loading.value = false;
    }
};
</script>

<template>
  <van-form submit-on-enter @submit="onSubmit">
    <a href="https://github.com/orcastor/orcas" target="_blank">
      <img src="/logo.svg" class="logo" alt="orcas logo" />
    </a>
    <input placeholder="输入用户名" v-model="loginForm.username">
    <input type="password" placeholder="输入密码" v-model="loginForm.password">
    <button type="submit">登录</button>
  </van-form>
</template>

<style scoped>
</style>
