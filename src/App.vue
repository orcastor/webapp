<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Login } from "@/api/interface";
import { Notify } from 'vant';
import { loginApi } from "@/api/modules/login";
import { GlobalStore } from "@/store";
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
    <van-cell-group inset>
      <van-field
        v-model="loginForm.username"
        placeholder="请输入用户名"
        maxlength=20
        enterkeyhint="done"
      />
    </van-cell-group>
    <br />
    <van-cell-group inset>
      <van-field
        v-model="loginForm.password"
        placeholder="请输入密码"
        maxlength=20
        enterkeyhint="done"
        type="password"
      />
    </van-cell-group>
    <br />
    <div style="margin: 16px;">
      <van-button :loading="loading" round block type="primary" native-type="submit">
        登录
      </van-button>
    </div>
  </van-form>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2px #aaa);
}
</style>
