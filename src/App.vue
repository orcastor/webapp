<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Login } from "./api/interface";
import { Notify } from 'vant';
import superagent from 'superagent';
import 'vant/es/notify/style';
// 登录表单数据
const loginForm = reactive<Login.ReqLoginForm>({
  username: "",
  password: "",
});

const loading = ref(false);
const onSubmit = (values:any) => {
  loading.value = true;
  superagent
    .post('/api/login')
    .send(loginForm)
    .end(function (err:any, res:any) {
      if(err) {
        Notify({ type: 'warning', message: "服务器错误，请稍候重试" });
      } else if(res.statusCode != 200) {
        Notify({ type: 'warning', message: "服务器错误，请稍候重试，错误码："+res.statusCode });
      } else {
        var resp = JSON.parse(res.text);
        if(!resp.code) {
          Notify({ type: 'success', message: '登录成功' });
        } else {
          Notify({ type: 'warning', message: resp.msg });
        }
      }
      loading.value = false;
    });
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
