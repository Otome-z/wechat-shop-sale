<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { createProduct, fetchProductDetail, updateProduct } from "@/api/product";
import { useAuthStore } from "@/store/auth";

const DEFAULT_PRODUCT_IMAGE_URL =
  "https://pic4.zhimg.com/80/v2-5107688cc637cf3cf5044c4a475ba7ad_720w.webp";

const authStore = useAuthStore();
const loading = ref(false);
const productId = ref<number | null>(null);
const productStatus = ref<"ON_SALE" | "OFF_SHELF">("ON_SALE");

const form = reactive({
  name: "",
  imageUrl: DEFAULT_PRODUCT_IMAGE_URL,
  description: "",
  price: 0,
  stock: 0,
});

const isEditMode = computed(() => productId.value !== null);
const pageTitle = computed(() => (isEditMode.value ? "编辑商品" : "上架商品"));
const pageSubtitle = computed(() =>
  isEditMode.value ? "停售后可编辑商品基础信息" : "填写商品基础信息并立即上架"
);

function goBackToProducts() {
  uni.reLaunch({ url: "/pages/merchant/products/index" });
}

async function loadProductDetail(id: number) {
  loading.value = true;

  try {
    const product = (await fetchProductDetail(id)).data;
    productId.value = product.id;
    productStatus.value = product.status;
    form.name = product.name;
    form.imageUrl = product.imageUrl;
    form.description = product.description;
    form.price = product.price;
    form.stock = product.stock;

    if (product.status !== "OFF_SHELF") {
      uni.showToast({ title: "只有停售商品才能编辑", icon: "none" });
      setTimeout(goBackToProducts, 300);
    }
  } catch (error) {
    uni.showToast({ title: "商品加载失败", icon: "none" });
    setTimeout(goBackToProducts, 300);
  } finally {
    loading.value = false;
  }
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
    if (isEditMode.value && productId.value !== null) {
      await updateProduct(productId.value, {
        name: form.name,
        imageUrl: form.imageUrl,
        description: form.description,
        price: Number(form.price),
      });
      uni.showToast({ title: "商品信息已更新", icon: "success" });
    } else {
      await createProduct({
        name: form.name,
        imageUrl: form.imageUrl,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      uni.showToast({ title: "商品已上架", icon: "success" });
    }

    setTimeout(goBackToProducts, 300);
  } catch (error) {
    uni.showToast({
      title: isEditMode.value ? "商品更新失败" : "上架失败",
      icon: "none",
    });
  }
}

onLoad((options) => {
  if (!authStore.hasRole("merchant")) {
    uni.reLaunch({ url: "/pages/login/index" });
    return;
  }

  const id = Number(options?.id || 0);
  if (id > 0) {
    loadProductDetail(id);
  }
});
</script>

<template>
  <view class="page-shell">
    <view class="page-header">
      <text class="page-title">{{ pageTitle }}</text>
      <text class="page-subtitle">{{ pageSubtitle }}</text>
    </view>

    <view v-if="loading" class="card loading-card">正在加载商品信息...</view>

    <view v-else class="card form-card">
      <view v-if="isEditMode" class="status-tip">
        当前状态：{{ productStatus === "OFF_SHELF" ? "停售" : "在售" }}
      </view>

      <view class="field">
        <text class="label">商品名称</text>
        <input v-model="form.name" class="input" placeholder="例如 春季新品" />
      </view>

      <view class="field">
        <text class="label">图片链接</text>
        <input v-model="form.imageUrl" class="input" placeholder="请输入商品图片链接" />
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
        <input v-model="form.price" class="input" type="digit" placeholder="请输入价格" />
      </view>

      <view v-if="!isEditMode" class="field">
        <text class="label">库存</text>
        <input v-model="form.stock" class="input" type="number" placeholder="请输入库存" />
      </view>

      <view v-else class="field note-field">
        <text class="note-text">库存请返回仓库页单独调整，停售商品才允许编辑基础信息。</text>
      </view>

      <button class="primary-btn" @tap="handleSubmit">
        {{ isEditMode ? "保存修改" : "确认上架" }}
      </button>
      <button class="plain-btn" @tap="goBackToProducts">返回仓库页</button>
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

.loading-card,
.form-card {
  padding: 32rpx;
}

.status-tip {
  margin-bottom: 24rpx;
  padding: 18rpx 20rpx;
  border-radius: 16rpx;
  background: #f3f4f6;
  color: #374151;
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
  box-sizing: border-box;
  background: #f3f4f6;
}

.textarea {
  height: 220rpx;
}

.note-field {
  padding: 20rpx 24rpx;
  border-radius: 18rpx;
  background: #fff7ed;
}

.note-text {
  color: #9a3412;
  font-size: 26rpx;
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
