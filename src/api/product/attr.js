import request from '@/utils/request';
// 获取一级分类
// /admin/product/get/category1/{id} get
export const reqCategory1Id = () => request({
  url: `/admin/product/getCategory1`,
  method: 'get'
})
// 获取二级分类
export const reqCategory2Id = category1Id => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: 'get'
})
// 获取三级分类
export const reqCategory3Id = category2Id => request({
  url: `/admin/product/getCategory3/${category2Id}`,
  method: 'get'
})

// 获取平台属性
export const reqAttrList = (categoryId) => {
  let {
    category1Id,
    category2Id,
    category3Id
  } = categoryId;
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })
}

// 添加属性和属性值接口
export const reqAddOrUpdateAttrInfo = (attrInfo) => request({
  url: `/admin/product/saveAttrInfo`,
  method: 'post',
  data: attrInfo
})
