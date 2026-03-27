<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { addToCart } from "@/api/cart";
import { fetchProductDetail } from "@/api/product";
import type { ProductItem } from "@/types/shop";

const product = ref<ProductItem | null>(null);
const loading = ref(false);

async function loadDetail(id: number) {
  loading.value = true;

  try {
    product.value = (await fetchProductDetail(id)).data;
  } catch (error) {
    uni.showToast({ title: "商品加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
}

async function handleAddToCart() {
  if (!product.value) {
    return;
  }

  try {
    await addToCart({ productId: product.value.id, quantity: 1 });
    uni.showToast({ title: "已加入购物车", icon: "success" });
  } catch (error) {
    uni.showToast({ title: "加入失败", icon: "none" });
  }
}

onLoad((options) => {
  const productId = Number(options?.id || 0);

  if (!productId) {
    uni.showToast({ title: "商品参数无效", icon: "none" });
    return;
  }

  loadDetail(productId);
});
</script>

<template>
  <view class="page-shell">
    <view v-if="loading" class="card detail-card">正在加载商品...</view>

    <view v-else-if="product" class="card detail-card">
      <image class="detail-image" :src="product.imageUrl" mode="aspectFill" />
      <text class="title">{{ product.name }}</text>
      <text class="price">￥{{ product.price.toFixed(2) }}</text>
      <text class="meta">商家：{{ product.merchantName || "店铺商家" }}</text>
      <text class="meta">库存：{{ product.stock }}</text>
      <text class="desc">{{ product.description }}</text>
      <button class="primary-btn" @tap="handleAddToCart">加入购物车</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.detail-card {
  padding: 32rpx;
}

.detail-image {
  width: 100%;
  height: 360rpx;
  border-radius: 24rpx;
  background: #e5e7eb;
}

.title {
  display: block;
  margin-top: 24rpx;
  font-size: 46rpx;
  font-weight: 700;
}

.price {
  display: block;
  margin-top: 20rpx;
  color: #b45309;
  font-size: 40rpx;
  font-weight: 700;
}

.meta,
.desc {
  display: block;
  margin-top: 18rpx;
  color: #4b5563;
}

.primary-btn {
  margin-top: 40rpx;
  border: none;
  border-radius: 18rpx;
  background: #111827;
  color: #ffffff;
}
</style>
