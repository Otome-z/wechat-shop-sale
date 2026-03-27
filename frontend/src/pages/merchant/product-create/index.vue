<script setup lang="ts">
import { reactive } from "vue";
import { createProduct } from "@/api/product";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();
const form = reactive({
  name: "",
  description: "",
  price: 0,
  stock: 0,
});

function goBackToProducts() {
  uni.reLaunch({ url: "/pages/merchant/products/index" });
}

async function handleSubmit() {
  if (!authStore.hasRole("merchant")) {
    uni.showToast({ title: "当前不是商家模式", icon: "none" });
    return;
  }

  if (!form.name || !form.description || form.price <= 0 || form.stock < 0) {
    uni.showToast({ title: "请填写完整商品信息", icon: "none" });
    return;
  }

  try {
    await createProduct({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
    });
    uni.showToast({ title: "商品已上架", icon: "success" });
    setTimeout(goBackToProducts, 300);
  } catch (error) {
    uni.showToast({ title: "上架失败", icon: "none" });
  }
}
</script>

<template>
  <view class="page-shell">
    <view class="page-header">
      <text class="page-title">上架商品</text>
      <text class="page-subtitle">填写商品基础信息并立即上架</text>
    </view>

    <view class="card form-card">
      <view class="field">
        <text class="label">商品名称</text>
        <input v-model="form.name" class="input" placeholder="例如 春季新品" />
      </view>

      <view class="field">
        <text class="label">商品描述</text>
        <textarea
          v-model="form.description"
          class="textarea"
          placeholder="请输入商品卖点"
        />
      </view>

      <view class="field">
        <text class="label">价格</text>
        <input
          v-model="form.price"
          class="input"
          type="digit"
          placeholder="请输入价格"
        />
      </view>

      <view class="field">
        <text class="label">库存</text>
        <input
          v-model="form.stock"
          class="input"
          type="number"
          placeholder="请输入库存"
        />
      </view>

      <button class="primary-btn" @tap="handleSubmit">确认上架</button>
      <button class="plain-btn" @tap="goBackToProducts">返回商品页</button>
    </view>
  </view>
</template>

<style scoped lang="scss">
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

.form-card {
  padding: 32rpx;
}

.field + .field {
  margin-top: 24rpx;
}

.label {
  display: block;
  margin-bottom: 12rpx;
}

.input,
.textarea {
  width: 100%;
  padding: 20rpx 24rpx;
  border-radius: 18rpx;
  background: #f3f4f6;
}

.textarea {
  height: 220rpx;
}

.primary-btn {
  margin-top: 32rpx;
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
}
</style>
