import request from '@/utils/request';
// 获取分页列表 page:当前页数，limit：每页显示数据条数 method：get
export const reqTradeMarkList = (page,limit) => request({
    url:`/admin/product/baseTrademark/${page}/${limit}`,
    method:'get'
})

// 新增商品
// /admin/product/baseTrademark/save get
// 更新商品
// /admin/product/baseTrademark/update post
export const reqSaveOrUpdateTradeMark = tradeMark =>{
    if(tradeMark.id){
        request({
            url:`/admin/product/baseTrademark/save/${tradeMark}`,
            method:'post'
        })
    }else{
        request({
            url:`/admin/product/baseTrademark/update/${tradeMark}`,
            method:'put'
        })
    }
}