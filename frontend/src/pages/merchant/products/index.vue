<script setup lang="ts">
import { onMounted, ref } from "vue";
import BottomNav from "@/components/bottom-nav.vue";
import {
  fetchProducts,
  updateProductStatus,
  updateProductStock,
} from "@/api/product";
import { useAuthStore } from "@/store/auth";
import type { ProductItem } from "@/types/shop";

const authStore = useAuthStore();
const products = ref<ProductItem[]>([]);
const loading = ref(false);
const pendingId = ref<number | null>(null);

async function loadProducts() {
  loading.value = true;

  try {
    products.value = (await fetchProducts()).data;
  } catch (error) {
    uni.showToast({ title: "加载仓库数据失败", icon: "none" });
  } finally {
    loading.value = false;
  }
}

function goCreate() {
  uni.navigateTo({ url: "/pages/merchant/product-create/index" });
}

function goEdit(id: number) {
  uni.navigateTo({ url: `/pages/merchant/product-create/index?id=${id}` });
}

async function changeStock(item: ProductItem, delta: number) {
  const nextStock = item.stock + delta;
  if (nextStock < 0) {
    uni.showToast({ title: "库存不能小于 0", icon: "none" });
    return;
  }

  pendingId.value = item.id;
  try {
    const updated = (await updateProductStock(item.id, { stock: nextStock })).data;
    products.value = products.value.map((product) => (product.id === item.id ? updated : product));
    uni.showToast({ title: "库存已更新", icon: "success" });
  } catch (error) {
    uni.showToast({ title: "库存更新失败", icon: "none" });
  } finally {
    pendingId.value = null;
  }
}

async function toggleStatus(item: ProductItem) {
  pendingId.value = item.id;
  const nextStatus = item.status === "ON_SALE" ? "OFF_SHELF" : "ON_SALE";

  try {
    const updated = (await updateProductStatus(item.id, { status: nextStatus })).data;
    products.value = products.value.map((product) => (product.id === item.id ? updated : product));
    uni.showToast({
      title: nextStatus === "OFF_SHELF" ? "商品已停售" : "商品已恢复在售",
      icon: "success",
    });
  } catch (error) {
    uni.showToast({ title: "状态更新失败", icon: "none" });
  } finally {
    pendingId.value = null;
  }
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
      <text class="page-title">商家仓库</text>
      <text class="page-subtitle">管理商品信息、库存数量和销售状态</text>
    </view>

    <button class="primary-btn" @tap="goCreate">新增商品</button>

    <view v-if="loading" class="card empty-card">正在加载仓库商品...</view>

    <view v-else-if="!products.length" class="card empty-card">
      <text>仓库里还没有商品，先新增一个试试。</text>
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
          <text>状态 {{ item.status === "ON_SALE" ? "在售" : "停售" }}</text>
          <text :class="item.status === 'ON_SALE' ? 'status-sale' : 'status-stop'">
            {{ item.status === "ON_SALE" ? "顾客可见" : "顾客不可见" }}
          </text>
        </view>

        <view class="stock-panel">
          <text class="stock-label">库存数量</text>
          <view class="stock-actions">
            <button
              class="qty-btn"
              :disabled="pendingId === item.id || item.stock <= 0"
              @tap="changeStock(item, -1)"
            >
              -
            </button>
            <text class="stock-value">{{ item.stock }}</text>
            <button class="qty-btn" :disabled="pendingId === item.id" @tap="changeStock(item, 1)">
              +
            </button>
          </view>
        </view>

        <view class="action-row">
          <button class="secondary-btn" :disabled="pendingId === item.id" @tap="toggleStatus(item)">
            {{ item.status === "ON_SALE" ? "停售" : "恢复在售" }}
          </button>
          <button
            v-if="item.status === 'OFF_SHELF'"
            class="edit-btn"
            :disabled="pendingId === item.id"
            @tap="goEdit(item.id)"
          >
            编辑商品
          </button>
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
.meta-row,
.action-row {
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
  margin-top: 20rpx;
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

.status-sale {
  color: #047857;
}

.status-stop {
  color: #b91c1c;
}

.stock-panel {
  margin-top: 20rpx;
  padding: 20rpx;
  border-radius: 18rpx;
  background: #f9fafb;
}

.stock-label {
  color: #6b7280;
  font-size: 24rpx;
}

.stock-actions {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.qty-btn {
  width: 84rpx;
  margin: 0;
  border-radius: 14rpx;
}

.stock-value {
  min-width: 56rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 700;
}

.action-row {
  margin-top: 20rpx;
}

.secondary-btn,
.edit-btn {
  flex: 1;
  margin: 0;
  border-radius: 18rpx;
}

.secondary-btn {
  background: #111827;
  color: #ffffff;
}

.edit-btn {
  border: 2rpx solid #d1d5db;
  background: #ffffff;
  color: #111827;
}
</style>
