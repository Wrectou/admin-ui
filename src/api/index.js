import request from '@/utils/request'

// 登录
export const login = data => {
    return request({
        url: '/login',
        method: 'post',
        data
    })
}

// 获取个人章节列表
export const getSelflist = params => {
    return request({
        url: '/business/section/getSelflist',
        method: 'get',
        params
    })
}

// 获取章节最后答题问题ID
export const getSelfLastQuestionId = id => {
    return request({
        url: `/business/section/getSelfLastQuestionId/${id}`,
        method: 'get',
    })
}

// 查询章节列表
export const getSectionList = params => {
    return request({
        url: '/business/section/list',
        method: 'get',
        params
    })
}

// 新增章节
export const addBusinessSection = data => {
    return request({
        url: '/business/section',
        method: 'post',
        data
    })
}

// 获取章节详细信息
export const getBusinessSectionDetail = id => {
    return request({
        url: `/business/section/${id}`,
        method: 'get',
    })
}

// 编辑章节
export const editBusinessSection = data => {
    return request({
        url: "/business/section",
        method: 'put',
        data
    })
}

// 删除章节
export const deleteBusinessSection = id => {
    return request({
        url: `/business/section/${id}`,
        method: 'delete',
    })
}

// 获取每日练习题目
export const getTodayQuestion = params => {
    return request({
        url: '/business/question/todayQuestion',
        method: 'get',
        params
    })
}

// 查询考试试卷列表
export const getEpaperList = params => {
    return request({
        url: '/business/epaper/list',
        method: 'get',
        params
    })
}

// 查询问题列表
export const getQuestionList = params => {
    return request({
        url: '/business/question/list',
        method: 'get',
        params
    })
}

// 获取题目的选项
export const getQuestionItem = id => {
    return request({
        url: `/business/question/questionItem/${id}`,
        method: 'get',
    })
}

// 获取题目统计信息
export const getQuestionStatis = id => {
    return request({
        url: `/business/question/statis/${id}`,
        method: 'get',
    })
}

// 新增题目答题
export const addPracticeQuestionAnswer = data => {
    return request({
        url: '/business/practiceQuestionAnswer',
        method: 'post',
        data
    })
}

// 新增问题
export const addQuestion = data => {
    return request({
        url: '/business/question',
        method: 'post',
        data
    })
}

// 新增题目选项
export const addQuestionItem = data => {
    return request({
        url: '/business/questionItem',
        method: 'post',
        data
    })
}

// 删除问题
export const deleteQuestion = id => {
    return request({
        url: `/business/question/${id}`,
        method: 'delete',
    })
}

// 删除题目选项
export const deleteQuestionItem = id => {
    return request({
        url: `/business/questionItem/${id}`,
        method: 'delete',
    })
}

// 获取问题详细信息
export const getQuestionDetail = id => {
    return request({
        url: `/business/question/${id}`,
        method: 'get',
    })
}

// 获取题目选项详细信息
export const getQuestionItemDetail = id => {
    return request({
        url: `/business/questionItem/${id}`,
        method: 'get',
    })
}

// 查询题目选项列表
export const getQuestionItemList = params => {
    return request({
        url: '/business/questionItem/list',
        method: 'get',
        params
    })
}

// 编辑问题
export const editBusinessQuestion = data => {
    return request({
        url: "/business/question",
        method: 'put',
        data
    })
}

// 编辑题目选项
export const editBusinessQuestionItem = data => {
    return request({
        url: "/business/questionItem",
        method: 'put',
        data
    })
}















// 枚举数据
export const getEnum = () => {
    return request({
        url: '/v1/common/enum',
        method: 'get'
    })
}

// 首页数据
export const getHomeData = () => {
    return request({
        url: '/v1/index/data',
        method: 'get'
    })
}

// 产品列表
export const getProductList = params => {
    return request({
        url: '/v1/product',
        method: 'get',
        params
    })
}

// 金融机构选择
export const getChannelList = () => {
    return request({
        url: '/v1/channel/select',
        method: 'get',
    })
}

// 产品标签列表
export const getProductTag = params => {
    return request({
        url: '/v1/productTag',
        method: 'get',
        params
    })
}

// 解决方案选择
export const getSchemeList = () => {
    return request({
        url: '/v1/scheme/select',
        method: 'get',
    })
}

// 产品新增
export const addProduct = data => {
    return request({
        url: '/v1/product',
        method: 'post',
        data
    })
}

// 产品详情
export const getProductDetail = id => {
    return request({
        url: `/v1/product/${id}`,
        method: 'get',
    })
}

// 编辑产品
export const editProduct = (id, data) => {
    return request({
        url: `/v1/product/${id}`,
        method: 'put',
        data
    })
}

// 删除产品
export const deleteProduct = id => {
    return request({
        url: `/v1/product/${id}`,
        method: 'delete',
    })
}

// 产品列表区域筛选
export const getAreaList = () => {
    return request({
        url: '/v1/product/areaList',
        method: 'get',
    })
}

// 产品城市配置列表
export const getCitylist = (id, params) => {
    return request({
        url: `/v1/product/citylist/${id}`,
        method: 'get',
        params
    })
}

// 金融机构区域选择
export const getChannelAreaList = (channelId, params) => {
    return request({
        url: `/v1/channel/areaList/${channelId}`,
        method: 'get',
        params
    })
}

// 产品城市配置详情
export const getProductCityDetail = id => {
    return request({
        url: `/v1/product/city/${id}`,
        method: 'get',
    })
}

// 省市信息
export const getCommonCity = params => {
    return request({
        url: '/v1/common/city',
        method: 'get',
        params
    })
}

// 金融机构列表
export const getChannel = params => {
    return request({
        url: '/v1/channel',
        method: 'get',
        params
    })
}

// 获取七牛云配置
export const getQiniuConfig = () => {
    return request({
        url: '/v1/common/qiniu/config',
        method: 'get',
    })
}

// 金融机构新增
export const addChannel = data => {
    return request({
        url: '/v1/channel',
        method: 'post',
        data
    })
}

// 金融机构详情
export const getChannelDetail = id => {
    return request({
        url: `/v1/channel/${id}`,
        method: 'get',
    })
}

// 金融机构编辑
export const editChannel = (id, data) => {
    return request({
        url: `/v1/channel/${id}`,
        method: 'put',
        data
    })
}

// 金融机构删除
export const deleteChannel = id => {
    return request({
        url: `/v1/channel/${id}`,
        method: 'delete',
    })
}

// 产品城市配置新增
export const addProductCity = data => {
    return request({
        url: '/v1/product/city',
        method: 'post',
        data
    })
}

// 产品城市配置编辑
export const editProductCity = (id, data) => {
    return request({
        url: `/v1/product/city/${id}`,
        method: 'put',
        data
    })
}

// 产品城市配置删除
export const deleteProductCity = id => {
    return request({
        url: `/v1/product/city/${id}`,
        method: 'delete',
    })
}

// 产品标签列表
export const getProductTagList = params => {
    return request({
        url: '/v1/productTag',
        method: 'get',
        params
    })
}

// 产品标签新增
export const addProductTag = data => {
    return request({
        url: '/v1/productTag',
        method: 'post',
        data
    })
}

// 产品标签编辑
export const editProductTag = (id, data) => {
    return request({
        url: `/v1/productTag/${id}`,
        method: 'put',
        data
    })
}

// 产品标签详情
export const getProductTagDetail = id => {
    return request({
        url: `/v1/productTag/${id}`,
        method: 'get',
    })
}

// 产品标签删除
export const deleteProductTag = id => {
    return request({
        url: `/v1/productTag/${id}`,
        method: 'delete',
    })
}

// 业务城市选择
export const getOperateCity = params => {
    return request({
        url: `/v1/operateCity/cityList`,
        method: 'get',
        params
    })
}

// 业务城市列表
export const getOperateCityList = params => {
    return request({
        url: '/v1/operateCity',
        method: 'get',
        params
    })
}

// 业务城市新增
export const addOperateCity = data => {
    return request({
        url: '/v1/operateCity',
        method: 'post',
        data
    })
}

// 业务城市编辑
export const editOperateCity = (id, data) => {
    return request({
        url: `/v1/operateCity/${id}`,
        method: 'put',
        data
    })
}

// 业务城市详情
export const getOperateCityDetail = id => {
    return request({
        url: `/v1/operateCity/${id}`,
        method: 'get',
    })
}

// 业务城市删除
export const deleteOperateCity = id => {
    return request({
        url: `/v1/operateCity/${id}`,
        method: 'delete',
    })
}

// 文章列表
export const getArticleList = params => {
    return request({
        url: '/v1/article',
        method: 'get',
        params
    })
}

// 文章编辑
export const editArticle = (id, data) => {
    return request({
        url: `/v1/article/${id}`,
        method: 'put',
        data
    })
}

// 文章详情
export const getArticleDetail = id => {
    return request({
        url: `/v1/article/${id}`,
        method: 'get',
    })
}

// 文章删除
export const deleteArticle = id => {
    return request({
        url: `/v1/article/${id}`,
        method: 'delete',
    })
}

// 文章同步列表
export const getArticleSyncList = params => {
    return request({
        url: '/v1/articleSync',
        method: 'get',
        params
    })
}

// 文章同步编辑
export const editArticleSync = (id, data) => {
    return request({
        url: `/v1/articleSync/${id}`,
        method: 'put',
        data
    })
}

// 文章同步新增
export const addArticleSync = data => {
    return request({
        url: '/v1/articleSync',
        method: 'post',
        data
    })
}

// 文章同步删除
export const deleteArticleSync = id => {
    return request({
        url: `/v1/articleSync/${id}`,
        method: 'delete',
    })
}

// 平台信息编辑
export const editPlatformInfo = data => {
    return request({
        url: `/v1/platformInfo`,
        method: 'put',
        data
    })
}

// 平台信息详情
export const getPlatformInfoDetail = () => {
    return request({
        url: `/v1/platformInfo`,
        method: 'get',
    })
}

// 广告列表
export const getAdvertList = params => {
    return request({
        url: '/v1/ad',
        method: 'get',
        params
    })
}

// 广告新增
export const addAdvert = data => {
    return request({
        url: '/v1/ad',
        method: 'post',
        data
    })
}

// 广告编辑
export const editAdvert = (id, data) => {
    return request({
        url: `/v1/ad/${id}`,
        method: 'put',
        data
    })
}

// 广告删除
export const deleteAdvert = id => {
    return request({
        url: `/v1/ad/${id}`,
        method: 'delete',
    })
}

// 广告详情
export const getAdvertDetail = id => {
    return request({
        url: `/v1/ad/${id}`,
        method: 'get',
    })
}

// 首页轮播列表
export const getBannerList = params => {
    return request({
        url: '/v1/banner',
        method: 'get',
        params
    })
}

// 首页轮播新增
export const addBanner = data => {
    return request({
        url: '/v1/banner',
        method: 'post',
        data
    })
}

// 首页轮播编辑
export const editBanner = (id, data) => {
    return request({
        url: `/v1/banner/${id}`,
        method: 'put',
        data
    })
}

// 首页轮播删除
export const deleteBanner = id => {
    return request({
        url: `/v1/banner/${id}`,
        method: 'delete',
    })
}

// 首页轮播详情
export const getBannerDetail = id => {
    return request({
        url: `/v1/banner/${id}`,
        method: 'get',
    })
}

//产品订单列表
export const getOrderList = (params) => {
    return request({
        url: `/v1/order`,
        method: 'get',
        params
    })
}

//订单详情
export const getOrderparticulars = id => {
    return request({
        url: `/v1/order/${id}`,
        method: 'get',
    })
}

//删除订单
export const deleteOrderparticulars = id => {
    return request({
        url: `/v1/order/${id}`,
        method: 'DELETE',
    })
}

//解决方案列表
export const getsolutionlist = (params) => {
    return request({
        url: `/v1/scheme`,
        method: 'get',
        params
    })
}

//删除解决方案
export const deletesolution = id => {
    return request({
        url: `/v1/scheme/${id}`,
        method: 'DELETE',
    })
}

//解决方案城市配置列表
export const getcityconfiguration = schemeId => {
    return request({
        url: `/v1/product/citylist/${schemeId}`,
        method: 'GET',
    })
}