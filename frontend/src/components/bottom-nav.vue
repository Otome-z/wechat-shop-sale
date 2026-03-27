<script setup lang="ts">
import type { UserRole } from "../types/user";
import { computed } from "vue";
import { useAuthStore } from "../store/auth";
import { getTabItemsByRole } from "../utils/navigation";

interface Props {
  currentPath: string
}

const props = defineProps<Props>();
const authStore = useAuthStore();
const tabs = computed(() =>
  getTabItemsByRole((authStore.role || "customer") as UserRole),
);

function goTab(path: string) {
  if (path === props.currentPath) {
    return;
  }

  uni.reLaunch({ url: path });
}
</script>

<template>
  <view class="bottom-nav">
    <view
      v-for="item in tabs"
      :key="item.path"
      :class="[
        'bottom-nav__item',
        { 'bottom-nav__item--active': item.path === currentPath },
      ]"
      @tap="goTab(item.path)"
    >
      <text>{{ item.label }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-auto-flow: column;
  height: 112rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;
  border-top: 2rpx solid #e5e7eb;
}

.bottom-nav__item {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 28rpx;
}

.bottom-nav__item--active {
  color: #111827;
  font-weight: 700;
}
</style>
