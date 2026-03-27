<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "../../store/auth";

const authStore = useAuthStore();
const form = reactive({
  username: "",
  password: ""
});

async function handleLogin() {
  if (!form.username || !form.password) {
    uni.showToast({ title: "请输入账号和密码", icon: "none" });
    return;
  }

  try {
    await authStore.login(form);
    uni.reLaunch({ url: "/pages/profile/index" });
  } catch (error) {
    uni.showToast({ title: "登录失败", icon: "none" });
  }
}

function goRegister() {
  uni.navigateTo({ url: "/pages/register/index" });
}
</script>

<template>
  <view class="page-shell login-page">
    <view class="hero">
      <text class="hero-title">店铺购物</text>
      <text class="hero-subtitle">登录后先进入个人信息页</text>
    </view>

    <view class="card form-card">
      <view class="field">
        <text class="label">账号</text>
        <input v-model="form.username" class="input" placeholder="请输入账号" />
      </view>

      <view class="field">
        <text class="label">密码</text>
        <input v-model="form.password" class="input" password placeholder="请输入密码" />
      </view>

      <button class="primary-btn" @tap="handleLogin">登录</button>
      <button class="plain-btn" @tap="goRegister">去注册</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40rpx;
}

.hero {
  padding: 24rpx 8rpx;
}

.hero-title {
  display: block;
  font-size: 52rpx;
  font-weight: 700;
}

.hero-subtitle {
  display: block;
  margin-top: 12rpx;
  color: #6b7280;
}

.form-card {
  padding: 40rpx 32rpx;
}

.field + .field {
  margin-top: 24rpx;
}

.label {
  display: block;
  margin-bottom: 12rpx;
  color: #374151;
}

.input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  border-radius: 18rpx;
  background: #f3f4f6;
}

.primary-btn {
  margin-top: 36rpx;
  border: none;
  border-radius: 18rpx;
  background: #111827;
  color: #ffffff;
}

.plain-btn {
  margin-top: 20rpx;
  border: 2rpx solid #d1d5db;
  border-radius: 18rpx;
  background: #ffffff;
  color: #111827;
}
</style>
