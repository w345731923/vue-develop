<template>
  <div class="login-container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      status-icon
      ref="ruleFormRef"
      label-width="90px"
      class="demo-ruleForm login-page"
    >
      <h3 class="title">注册</h3>
      <el-form-item prop="username" label="用户名">
        <el-input
          type="text"
          v-model="ruleForm.username"
          autocomplete="off"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password1" label="确认密码">
        <el-input
          type="password"
          v-model="ruleForm.password1"
          autocomplete="off"
          placeholder="确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="email"
        label="Email"
        :rules="[
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: '邮箱地址不合法',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-input
          type="text"
          v-model="ruleForm.email"
          autocomplete="off"
          placeholder="邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >注册</el-button
        >
        <el-button @click="goLogin" style="margin-left: 40px">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import { register } from "@/api/login";
import { ResponseData, LoginResp } from "@/types";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  username: "",
  password: "123",
  password1: "",
  email: "",
});

const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  password1: [{ required: true, message: "请输入确认密码", trigger: "blur" }],
});
const goLogin = () => {
  router.push("/login");
};
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!", ruleForm);
      if (ruleForm.password != ruleForm.password1) {
        ElMessage({
          message: "两次输入的密码不一致，请重新输入",
          type: "info",
        });
      } else {
        register(ruleForm).then((respon: ResponseData<any>) => {
          console.log("respon", respon);
          ElMessage({
            message: "注册成功！",
            type: "success",
            duration: 5 * 1000,
          });
        });
      }
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