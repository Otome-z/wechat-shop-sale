<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "../../store/auth";

const authStore = useAuthStore();
const form = reactive({
  username: "",
  password: "",
  nickname: "",
  phone: ""
});

async function handleRegister() {
  if (!form.username || !form.password || !form.nickname || !form.phone) {
    uni.showToast({ title: "请完整填写信息", icon: "none" });
    return;
  }

  try {
    await authStore.register(form);
    uni.reLaunch({ url: "/pages/profile/index" });
  } catch (error) {
    uni.showToast({ title: "注册失败", icon: "none" });
  }
}

function goLogin() {
  uni.navigateBack();
}
</script>

<template>
  <view class="page-shell">
    <view class="header">
      <text class="title">创建账号</text>
      <text class="subtitle">注册成功后直接进入我的页面</text>
    </view>

    <view class="card form-card">
      <view class="field">
        <text class="label">账号</text>
        <input v-model="form.username" class="input" placeholder="例如 shop_user" />
      </view>

      <view class="field">
        <text class="label">密码</text>
        <input v-model="form.password" class="input" password placeholder="请输入密码" />
      </view>

      <view class="field">
        <text class="label">昵称</text>
        <input v-model="form.nickname" class="input" placeholder="请输入昵称" />
      </view>

      <view class="field">
        <text class="label">手机号</text>
        <input v-model="form.phone" class="input" placeholder="请输入手机号" />
      </view>

      <button class="primary-btn" @tap="handleRegister">注册</button>
      <button class="plain-btn" @tap="goLogin">返回登录</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.header {
  padding: 48rpx 8rpx 32rpx;
}

.title {
  display: block;
  font-size: 46rpx;
  font-weight: 700;
}

.subtitle {
  display: block;
  margin-top: 10rpx;
  color: #6b7280;
}

.form-card {
  padding: 36rpx 32rpx;
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
