import request from '@/utils/request';
// 获取分页列表 page:当前页数，limit：每页显示数据条数 method：get
export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

// 新增商品
// /admin/product/baseTrademark/save get
// 更新商品
// /admin/product/baseTrademark/update post
export const reqAddOrUpdateTradeMark = tradeMark => {
  // 不存在id则添加商品
  if (!tradeMark.id) {
    return request({
      url: `/admin/product/baseTrademark/save`,
      method: 'post',
      data: tradeMark
    })
    // 存在id则修改
  } else {
    return request({
      url: `/admin/product/baseTrademark/update/`,
      method: 'put',
      data: tradeMark
    })
  }
}

// 删除商品
export const reqDeleteTradeMark = id => request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})
