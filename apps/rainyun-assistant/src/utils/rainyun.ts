export function getProductDisplayName(product: ProductType) {
  const productMap = {
    "": "未知",
    rvh: "虚拟主机",
    rcs: "云服务器",
    rbm: "裸金属",
    rgs: "游戏云",
    domain: "域名服务",
    rcdn: "雨盾CDN",
    ros: "对象存储",
    ssl: "SSL证书",
  } as const
  return productMap[product] || product
}

export const getQQAvatarUrl = (email: string) => {
  if (!email?.endsWith("@qq.com")) return ""

  const qq = email.replace("@qq.com", "")
  if (!/^\d+$/.test(qq)) return ""

  return `https://q2.qlogo.cn/headimg_dl?bs=${qq}&dst_uin=${qq}&dst_uin=${qq}&;dst_uin=${qq}&spec=100&url_enc=0&referer=bu_interface&term_type=PC`
}
