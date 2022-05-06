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

// 查询考试指南列表
export const getGuideList = params => {
    return request({
        url: '/business/guide/list',
        method: 'get',
        params
    })
}

// 获取考试指南详细信息
export const getGuideDetail = id => {
    return request({
        url: `/business/guide/${id}`,
        method: 'get',
    })
}

// 删除考试指南
export const deleteGuide = id => {
    return request({
        url: `/business/guide/${id}`,
        method: 'delete',
    })
}

// 新增考试指南
export const addGuidem = data => {
    return request({
        url: '/business/guide',
        method: 'post',
        data
    })
}

// 修改考试指南
export const editGuide = data => {
    return request({
        url: "/business/guide",
        method: 'put',
        data
    })
}

// 收藏
export const addFavorite = data => {
    return request({
        url: '/business/practiceFavorites',
        method: 'post',
        data
    })
}

// 取消收藏
export const deleteFavorite = params => {
    return request({
        url: `/business/practiceFavorites/del`,
        method: 'delete',
        params
    })
}

// 获取收藏目录
export const getFavoritesQuestionSectionList = params => {
    return request({
        url: '/business/practiceFavorites/questionSectionList',
        method: 'get',
        params
    })
}

// 获取收藏题目列表
export const getFavoritesQuestionList = params => {
    return request({
        url: '/business/practiceFavorites/questionList',
        method: 'get',
        params
    })
}

// 获取考试试卷详细信息
export const getEpaperDetail = id => {
    return request({
        url: `/business/epaper/${id}`,
        method: 'get',
    })
}

// 获取收藏所有题目列表
export const getErrQuestionAllList = params => {
    return request({
        url: '/business/practiceFavorites/questionAllList',
        method: 'get',
        params
    })
}

// 查询专题学习目录列表
export const getLearnCatalogueList = params => {
    return request({
        url: '/business/learnCatalogue/list',
        method: 'get',
        params
    })
}

// 新增专题学习目录
export const addLearnCatalogue = data => {
    return request({
        url: '/business/learnCatalogue',
        method: 'post',
        data
    })
}

// 获取专题学习目录详细信息
export const getLearnCatalogueDetail = id => {
    return request({
        url: `/business/learnCatalogue/${id}`,
        method: 'get',
    })
}

// 删除专题学习目录
export const deleteLearnCatalogue = id => {
    return request({
        url: `/business/learnCatalogue/${id}`,
        method: 'delete',
    })
}

// 修改专题学习目录
export const editLearnCatalogue = data => {
    return request({
        url: "/business/learnCatalogue",
        method: 'put',
        data
    })
}


// 查询专题学习资料列表
export const getLearnMaterialsList = params => {
    return request({
        url: '/business/learnMaterials/list',
        method: 'get',
        params
    })
}

// 删除专题学习资料
export const deleteLearnMaterials = id => {
    return request({
        url: `/business/learnMaterials/${id}`,
        method: 'delete',
    })
}

// 获取专题学习资料详细信息
export const getLearnMaterialsDetail = id => {
    return request({
        url: `/business/learnMaterials/${id}`,
        method: 'get',
    })
}

// 修改专题学习资料
export const editLearnMaterials = data => {
    return request({
        url: "/business/learnMaterials",
        method: 'put',
        data
    })
}

// 新增专题学习资料
export const addLearnMaterials = data => {
    return request({
        url: '/business/learnMaterials',
        method: 'post',
        data
    })
}

// 查询自己的考试试卷列表
export const getEpaperSelflist = params => {
    return request({
        url: '/business/epaper/selflist',
        method: 'get',
        params
    })
}

// 管理系统-查询考试试卷列表
export const getAdminEpaperList = params => {
    return request({
        url: '/business/epaper/list',
        method: 'get',
        params
    })
}

// 新增考试试卷
export const addEpaper = data => {
    return request({
        url: '/business/epaper',
        method: 'post',
        data
    })
}

// 修改考试试卷
export const editEpaper = data => {
    return request({
        url: "/business/epaper",
        method: 'put',
        data
    })
}   

// 删除考试试卷
export const deleteEpaper = id => {
    return request({
        url: `/business/epaper/${id}`,
        method: 'delete',
    })
}

// 部门人员列表
export const getDeptUsersList = params => {
    return request({
        url: '/system/dept/deptUsers',
        method: 'get',
        params
    })
}

// 新增试卷参考人员
export const addEpaperUser = data => {
    return request({
        url: '/business/epaperUser',
        method: 'post',
        data
    })
}

// 根据试卷ID查询参考人员ID数组
export const getEpaperUserList = params => {
    return request({
        url: '/business/epaperUser/list',
        method: 'get',
        params
    })
}

// 删除参考人员
export const deleteEpaperUser = data => {
    return request({
        url: '/business/epaperUser/deleteUsers',
        method: 'post',
        data
    })
}

// 章节题目列表
export const getAllSectionQuestionList = params => {
    return request({
        url: '/business/section/allSectionQuestionList',
        method: 'get',
        params
    })
}

// 新增考试题库数组
export const addEpaperQuestion = data => {
    return request({
        url: '/business/epaperQuestion',
        method: 'post',
        data
    })
}

// 根据试卷ID查询考试题库列表
export const getEpaperQuestionList = params => {
    return request({
        url: '/business/epaperQuestion/list',
        method: 'get',
        params
    })
}

// 删除考试题目数组
export const deleteEpaperQuestion = data => {
    return request({
        url: '/business/epaperQuestion/deleteQuestions',
        method: 'post',
        data
    })
}

// 获取试卷题目
export const getTestEpaperQuestionList = params => {
    return request({
        url: '/business/epaper/epaperQuestionlist',
        method: 'get',
        params
    })
}

// 生成本轮考试成绩ID
export const createEpaperScore = data => {
    return request({
        url: '/business/epaperScore',
        method: 'post',
        data
    })
}

// 考试交卷
export const epaperCommit = data => {
    return request({
        url: '/business/epaper/commit',
        method: 'post',
        data
    })
}

// 获取自己的收藏题目列表
export const getSelfQuestionAllList = params => {
    return request({
        url: '/business/practiceFavorites/selfQuestionAllList',
        method: 'get',
        params
    })
}

// 今日学习情况
export const getTodayLearnGrade = params => {
    return request({
        url: '/business/question/todayLearnGrade',
        method: 'get',
        params
    })
}

// 获取最新5条专题学习资料
export const getNewlist = params => {
    return request({
        url: '/business/learnMaterials/newlist',
        method: 'get',
        params
    })
}

// 考试成绩统计（自己）
export const getHisEpaperScoreList = params => {
    return request({
        url: '/business/question/hisEpaperScoreList',
        method: 'get',
        params
    })
}

// 根据试卷ID统计人员的考试成绩
export const getEpaperPeopleStaticList = params => {
    return request({
        url: '/business/epaper/epaperPeopleStatic',
        method: 'get',
        params
    })
}

// 获取收藏-试卷列表（自己）
export const getPracticeFavoritesEpaperList = params => {
    return request({
        url: '/business/practiceFavorites/epaperList',
        method: 'get',
        params
    })
}

// 获取收藏-试卷题目列表（自己）
export const getPracticeFavoritesEpaperQuestionList = params => {
    return request({
        url: '/business/practiceFavorites/epaperQuestionList',
        method: 'get',
        params
    })
}