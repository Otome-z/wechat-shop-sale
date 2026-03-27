<script setup lang="ts">
import { onMounted, ref } from "vue";
import BottomNav from "@/components/bottom-nav.vue";
import { fetchProducts } from "@/api/product";
import { useAuthStore } from "@/store/auth";
import type { ProductItem } from "@/types/shop";

const authStore = useAuthStore();
const products = ref<ProductItem[]>([]);
const loading = ref(false);

async function loadProducts() {
  loading.value = true;

  try {
    products.value = (await fetchProducts()).data;
  } catch (error) {
    uni.showToast({ title: "加载商品失败", icon: "none" });
  } finally {
    loading.value = false;
  }
}

function goCreate() {
  uni.navigateTo({ url: "/pages/merchant/product-create/index" });
}

onMounted(async () => {
  if (!authStore.hasRole("merchant")) {
    uni.reLaunch({ url: "/pages/login/index" });
    return;
  }

  await loadProducts();
});
</script>

<template>
  <view class="page-shell page-with-nav">
    <view class="page-header">
      <text class="page-title">商家商品</text>
      <text class="page-subtitle">维护你上架的商品列表</text>
    </view>

    <button class="primary-btn" @tap="goCreate">上架商品</button>

    <view v-if="loading" class="card empty-card">正在加载商品...</view>

    <view v-else-if="!products.length" class="card empty-card">
      <text>还没有商品，先新增一个试试。</text>
    </view>

    <view v-else class="product-list">
      <view v-for="item in products" :key="item.id" class="card product-card">
        <image class="product-image" :src="item.imageUrl" mode="aspectFill" />
        <view class="product-row">
          <text class="product-name">{{ item.name }}</text>
          <text class="product-price">￥{{ item.price.toFixed(2) }}</text>
        </view>
        <text class="product-desc">{{ item.description }}</text>
        <view class="meta-row">
          <text>库存 {{ item.stock }}</text>
          <text>状态 {{ item.status === "ON_SALE" ? "上架中" : "已下架" }}</text>
        </view>
      </view>
    </view>

    <BottomNav current-path="/pages/merchant/products/index" />
  </view>
</template>

<style scoped lang="scss">
.page-with-nav {
  padding-bottom: 156rpx;
}

.page-header {
  padding: 12rpx 8rpx 24rpx;
}

.page-title {
  display: block;
  font-size: 46rpx;
  font-weight: 700;
}

.page-subtitle {
  display: block;
  margin-top: 10rpx;
  color: #6b7280;
}

.primary-btn {
  border: none;
  border-radius: 18rpx;
  background: #111827;
  color: #ffffff;
}

.product-list {
  margin-top: 24rpx;
  display: grid;
  gap: 24rpx;
}

.product-card,
.empty-card {
  padding: 28rpx;
}

.product-image {
  width: 100%;
  height: 260rpx;
  border-radius: 20rpx;
  background: #e5e7eb;
}

.product-row,
.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.product-name {
  flex: 1;
  margin-top: 20rpx;
  font-size: 32rpx;
  font-weight: 700;
}

.product-price {
  color: #b45309;
  font-weight: 700;
}

.product-desc {
  display: block;
  margin-top: 16rpx;
  color: #4b5563;
}

.meta-row {
  margin-top: 20rpx;
  color: #6b7280;
  font-size: 24rpx;
}
</style>
