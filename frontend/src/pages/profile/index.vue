<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAuthStore } from "../../store/auth";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const avatarText = computed(() => user.value?.nickname?.slice(0, 1) || "我");

onMounted(async () => {
  try {
    await authStore.loadProfile();
  } catch (error) {
    authStore.logout();
    uni.reLaunch({ url: "/pages/login/index" });
  }
});

function handleLogout() {
  authStore.logout();
  uni.reLaunch({ url: "/pages/login/index" });
}
</script>

<template>
  <view class="page-shell">
    <view class="card profile-card">
      <view class="avatar">{{ avatarText }}</view>
      <text class="nickname">{{ user?.nickname || "未登录用户" }}</text>
      <text class="meta">用户 ID：{{ user?.id || "-" }}</text>
      <text class="meta">账号：{{ user?.username || "-" }}</text>
      <text class="meta">手机号：{{ user?.phone || "-" }}</text>
    </view>

    <view class="card section-card">
      <view class="section-row">
        <text class="section-label">页面定位</text>
        <text class="section-value">我的 / 个人信息</text>
      </view>
      <view class="section-row">
        <text class="section-label">登录状态</text>
        <text class="section-value">已登录</text>
      </view>
    </view>

    <button class="logout-btn" @tap="handleLogout">退出登录</button>
  </view>
</template>

<style scoped lang="scss">
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 32rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #111827;
  color: #ffffff;
  font-size: 56rpx;
  font-weight: 700;
}

.nickname {
  margin-top: 24rpx;
  font-size: 40rpx;
  font-weight: 700;
}

.meta {
  margin-top: 12rpx;
  color: #4b5563;
}

.section-card {
  margin-top: 24rpx;
  padding: 16rpx 28rpx;
}

.section-row {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #f3f4f6;
}

.section-row:last-child {
  border-bottom: none;
}

.section-label {
  color: #6b7280;
}

.section-value {
  color: #111827;
}

.logout-btn {
  margin-top: 32rpx;
  border: none;
  border-radius: 18rpx;
  background: #dc2626;
  color: #ffffff;
}
</style>
