<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "../../store/auth";
import { getHomePathByRole } from "../../utils/navigation";
import type { UserRole } from "../../types/user";

const authStore = useAuthStore();
const form = reactive({
  username: "",
  password: "",
  role: "customer" as UserRole
});

const roleOptions: Array<{ label: string; value: UserRole; description: string }> = [
  { label: "客户模式", value: "customer", description: "浏览商品、加入购物车" },
  { label: "商家模式", value: "merchant", description: "上架商品、查看自己的商品" }
];

async function handleLogin() {
  if (!form.username || !form.password) {
    uni.showToast({ title: "请输入账号和密码", icon: "none" });
    return;
  }

  try {
    await authStore.login(form);
    uni.reLaunch({ url: getHomePathByRole(form.role) });
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
      <text class="hero-subtitle">登录时选择进入商家模式或客户模式</text>
    </view>

    <view class="card form-card">
      <view class="field">
        <text class="label">登录模式</text>
        <view class="role-list">
          <view
            v-for="item in roleOptions"
            :key="item.value"
            :class="['role-card', { 'role-card--active': form.role === item.value }]"
            @tap="form.role = item.value"
          >
            <text class="role-title">{{ item.label }}</text>
            <text class="role-desc">{{ item.description }}</text>
          </view>
        </view>
      </view>

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

.role-list {
  display: grid;
  gap: 20rpx;
}

.role-card {
  padding: 24rpx;
  border: 2rpx solid #d1d5db;
  border-radius: 20rpx;
}

.role-card--active {
  border-color: #111827;
  background: #f9fafb;
}

.role-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
}

.role-desc {
  display: block;
  margin-top: 10rpx;
  color: #6b7280;
  font-size: 24rpx;
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
