// 导入封装后的axios（request）
import request from '@/utils/request'
// 获取spu数据 /admin/product/{page}/{limit}
export const reqSpuList = (limit, page, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: 'get',
  params: {
    category3Id
  }
})

// 获取基本spu信息
export const reqSpuInfo = (spuId) => request({
  url: `/admin/product/getSpuById/${spuId}`,
  method: 'get'
})

// 获取品牌的信息
export const reqTradeMarkInfo = () => request({
  url: `/admin/product/baseTrademark/getTrademarkList`,
  method: 'get'
})

// 获取spu图标
export const reqSpuImageInfo = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method: 'get'
})

// 获取平台全部销售属性
export const reqSaleInfo = () => request({
  url: `/admin/product/baseSaleAttrList`,
  method: 'get'
})

// 添加或修改spu信息
export const reqAddOrUpdateSpuInfo = (data) => {
  if (!data.id) {
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'post',
      data: data
    })
  } else {
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'post',
      data: data
    })
  }
}
// 删除Spu
export const reqDeleteSpu = (spuId) => request({
  url: `/admin/product/deleteSpu/${spuId}`,
  method: 'delete'
})

// 获取图片数据接口
export const reqGetSpuImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method: 'get'
});

// 获取销售属性接口
export const reqGetSpuSaleAttrList = (spuId) => request({
  url: `/admin/product/spuSaleAttrList/${spuId}`,
  method: 'get'
})

// 获取商品基础属性接口
export const reqGetAttrInfoList = ({
  category1Id,
  category2Id,
  category3Id
}) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

// 添加商品信息接口
export const reqSaveSkuInfo = (data) => request({
  url: '/admin/product/saveSkuInfo',
  method: 'post',
  data: {skuInfo:data}
})

// 获取sku列表
export const reqGetSkuList = (spuId) => request({
  url:`/admin/product/findBySpuId/${spuId}`,
  method:'get'
})