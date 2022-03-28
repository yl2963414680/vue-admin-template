import request from '@/utils/request';

// 获取sku列表
export const reqGetSkuList = (page,limit)=>request({
    url:`/admin/product/list/${page}/${limit}`,
    method:'get'
})

// 上架sku
export const reqOnSale = (skuId)=>request({
    url:`/admin/product/onSale/${skuId}`,
    method:'get'
})
// 下架sku
export const reqCancelSale = (skuId)=>request({
    url:`/admin/product/cancelSale/${skuId}`,
    method:'get'
})

// 获取sku列表详情
export const reqGetSkuListById = (skuId)=>request({
    url:`/admin/product/getSkuById/${skuId}`,
    method:'get'
})