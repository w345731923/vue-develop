<template>
  <div class="login-container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      status-icon
      ref="ruleFormRef"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-page"
    >
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input
          type="text"
          v-model="ruleForm.username"
          autocomplete="off"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-checkbox v-model="ruleForm.checked" class="rememberme"
        >记住密码</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          type="primary"
          style="width: 100%"
          @click="submitForm(ruleFormRef)"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import { login } from "@/api/login";
import { ResponseData, LoginResp } from "@/types";
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router'
const router = useRouter()
console.log('router',router)
const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  username: "admin",
  password: "123",
  checked: true,
});

const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!", ruleForm);
      const data = { username: ruleForm.username, password: ruleForm.password };
      login(data).then((respon: ResponseData<LoginResp>) => {
        console.log("respon", respon);
        if (respon.code == 200) {
          //登录成功后，保存账号、密码、token
          localStorage.setItem("username", ruleForm.username);
          localStorage.setItem("password", ruleForm.password);
          localStorage.setItem("token", respon.data.token);

          ElMessage({
            message: "登录成功！",
            type: "success",
            duration: 5 * 1000,
          });
          router.push({ path: "/" });
        } else {
          //http拦截统一打印错误提示
        }
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>