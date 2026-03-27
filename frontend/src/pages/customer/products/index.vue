<script setup lang="ts">
import { onMounted, ref } from "vue";
import BottomNav from "@/components/bottom-nav.vue";
import { addToCart } from "@/api/cart";
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

function goDetail(id: number) {
  uni.navigateTo({ url: `/pages/customer/product-detail/index?id=${id}` });
}

async function handleAddToCart(id: number) {
  try {
    await addToCart({ productId: id, quantity: 1 });
    uni.showToast({ title: "已加入购物车", icon: "success" });
  } catch (error) {
    uni.showToast({ title: "加入失败", icon: "none" });
  }
}

onMounted(async () => {
  if (!authStore.hasRole("customer")) {
    uni.reLaunch({ url: "/pages/login/index" });
    return;
  }

  await loadProducts();
});
</script>

<template>
  <view class="page-shell page-with-nav">
    <view class="page-header">
      <text class="page-title">商品</text>
      <text class="page-subtitle">浏览所有在售商品</text>
    </view>

    <view v-if="loading" class="card empty-card">正在加载商品...</view>

    <view v-else-if="!products.length" class="card empty-card">暂无商品</view>

    <view v-else class="product-list">
      <view v-for="item in products" :key="item.id" class="card product-card">
        <view @tap="goDetail(item.id)">
          <view class="product-row">
            <text class="product-name">{{ item.name }}</text>
            <text class="product-price">￥{{ item.price.toFixed(2) }}</text>
          </view>
          <text class="product-desc">{{ item.description }}</text>
          <view class="meta-row">
            <text>商家 {{ item.merchantName || "店铺商家" }}</text>
            <text>库存 {{ item.stock }}</text>
          </view>
        </view>

        <button class="add-btn" @tap="handleAddToCart(item.id)">加入购物车</button>
      </view>
    </view>

    <BottomNav current-path="/pages/customer/products/index" />
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

.product-list {
  display: grid;
  gap: 24rpx;
}

.product-card,
.empty-card {
  padding: 28rpx;
}

.product-row,
.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
}

.product-name {
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

.add-btn {
  margin-top: 20rpx;
  border: none;
  border-radius: 18rpx;
  background: #111827;
  color: #ffffff;
}
</style>
