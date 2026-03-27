<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import BottomNav from "@/components/bottom-nav.vue";
import { deleteCartItem, fetchCart, updateCartItem } from "@/api/cart";
import { useAuthStore } from "@/store/auth";
import type { CartSummary } from "@/types/shop";

const authStore = useAuthStore();
const cart = ref<CartSummary>({ list: [], total: 0 });
const loading = ref(false);
const isEmpty = computed(() => !cart.value.list.length);

async function loadCart() {
  loading.value = true;

  try {
    cart.value = (await fetchCart()).data;
  } catch (error) {
    uni.showToast({ title: "购物车加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
}

async function changeQuantity(id: number, quantity: number) {
  if (quantity <= 0) {
    await handleDelete(id);
    return;
  }

  try {
    cart.value = (await updateCartItem(id, { quantity })).data;
  } catch (error) {
    uni.showToast({ title: "更新数量失败", icon: "none" });
  }
}

async function handleDelete(id: number) {
  try {
    cart.value = (await deleteCartItem(id)).data;
    uni.showToast({ title: "已移除", icon: "success" });
  } catch (error) {
    uni.showToast({ title: "删除失败", icon: "none" });
  }
}

onMounted(async () => {
  if (!authStore.hasRole("customer")) {
    uni.reLaunch({ url: "/pages/login/index" });
    return;
  }

  await loadCart();
});
</script>

<template>
  <view class="page-shell page-with-nav">
    <view class="page-header">
      <text class="page-title">购物车</text>
      <text class="page-subtitle">查看已加入的商品</text>
    </view>

    <view v-if="loading" class="card empty-card">正在加载购物车...</view>

    <view v-else-if="isEmpty" class="card empty-card">购物车还是空的，先去看看商品吧。</view>

    <view v-else>
      <view class="cart-list">
        <view v-for="item in cart.list" :key="item.id" class="card cart-card">
          <text class="product-name">{{ item.product.name }}</text>
          <text class="product-desc">{{ item.product.description }}</text>
          <view class="meta-row">
            <text>单价 ￥{{ item.product.price.toFixed(2) }}</text>
            <text>小计 ￥{{ item.subtotal.toFixed(2) }}</text>
          </view>
          <view class="quantity-row">
            <button class="qty-btn" @tap="changeQuantity(item.id, item.quantity - 1)">-</button>
            <text class="qty-text">{{ item.quantity }}</text>
            <button class="qty-btn" @tap="changeQuantity(item.id, item.quantity + 1)">+</button>
            <button class="delete-btn" @tap="handleDelete(item.id)">移除</button>
          </view>
        </view>
      </view>

      <view class="card total-card">
        <text class="total-label">合计</text>
        <text class="total-value">￥{{ cart.total.toFixed(2) }}</text>
      </view>
    </view>

    <BottomNav current-path="/pages/customer/cart/index" />
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

.cart-list {
  display: grid;
  gap: 24rpx;
}

.cart-card,
.total-card,
.empty-card {
  padding: 28rpx;
}

.product-name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
}

.product-desc {
  display: block;
  margin-top: 12rpx;
  color: #4b5563;
}

.meta-row,
.total-card,
.quantity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.meta-row {
  margin-top: 18rpx;
  color: #6b7280;
}

.quantity-row {
  margin-top: 20rpx;
}

.qty-btn,
.delete-btn {
  margin: 0;
  border-radius: 14rpx;
}

.qty-btn {
  width: 72rpx;
}

.qty-text {
  min-width: 40rpx;
  text-align: center;
}

.delete-btn {
  margin-left: auto;
  background: #fee2e2;
  color: #b91c1c;
}

.total-label {
  color: #6b7280;
}

.total-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #111827;
}
</style>
