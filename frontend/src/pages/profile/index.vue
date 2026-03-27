<script setup lang="ts">
import { computed, onMounted } from "vue";
import BottomNav from "../../components/bottom-nav.vue";
import { useAuthStore } from "../../store/auth";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const role = computed(() => authStore.role);
const avatarText = computed(() => user.value?.nickname?.slice(0, 1) || "我");
const roleLabel = computed(() =>
  role.value === "merchant" ? "商家模式" : "客户模式",
);
const roleDescription = computed(() =>
  role.value === "merchant"
    ? "当前可管理自己的商品并执行上架。"
    : "当前可浏览商品并管理购物车。",
);

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
  <view class="page-shell page-with-nav">
    <view class="card profile-card">
      <view class="avatar">{{ avatarText }}</view>
      <text class="nickname">{{ user?.nickname || "未登录用户" }}</text>
      <text class="meta">账号：{{ user?.username || "-" }}</text>
      <text class="meta">手机号：{{ user?.phone || "-" }}</text>
    </view>

    <view class="card section-card">
      <view class="section-row">
        <text class="section-label">当前身份</text>
        <text class="section-value">{{ roleLabel }}</text>
      </view>
      <view class="section-row">
        <text class="section-label">页面说明</text>
        <text class="section-value section-value--multiline">{{
          roleDescription
        }}</text>
      </view>
      <view class="section-row">
        <text class="section-label">用户 ID</text>
        <text class="section-value">{{ user?.id || "-" }}</text>
      </view>
    </view>

    <button class="logout-btn" @tap="handleLogout">退出登录</button>
    <BottomNav current-path="/pages/profile/index" />
  </view>
</template>

<style scoped lang="scss">
.page-with-nav {
  padding-bottom: 156rpx;
}

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
  gap: 20rpx;
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
  text-align: right;
}

.section-value--multiline {
  max-width: 420rpx;
}

.logout-btn {
  margin-top: 32rpx;
  border: none;
  border-radius: 18rpx;
  background: #dc2626;
  color: #ffffff;
}
</style>
