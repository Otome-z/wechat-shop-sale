import type { UserRole } from "../types/user";

export function getHomePathByRole(role: UserRole) {
  return role === "merchant"
    ? "/pages/merchant/products/index"
    : "/pages/customer/products/index";
}

export function getTabItemsByRole(role: UserRole) {
  if (role === "merchant") {
    return [
      { label: "商品", path: "/pages/merchant/products/index" },
      { label: "我的", path: "/pages/profile/index" },
    ];
  }

  return [
    { label: "商品", path: "/pages/customer/products/index" },
    { label: "购物车", path: "/pages/customer/cart/index" },
    { label: "我的", path: "/pages/profile/index" },
  ];
}
