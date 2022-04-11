import Layout from "@/layout"

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
*/

export const routes = [{
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [
            {
            path: "/redirect/:path(.*)",
            component: () => import ("@/views/redirect/index.vue"),
            }, 
        ],
    },
    {
        path: "/login",
        component: () => import ("@/views/login"),
        hidden: true,
    },
    {
        path: "/register",
        component: () => import ("@/views/register"),
        hidden: true,
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import ("@/views/error/404"),
        hidden: true,
    },
    {
        path: "/401",
        component: () => import ("@/views/error/401"),
        hidden: true,
    },

    {
        path: "",
        component: Layout,
        redirect: "/index",
        children: [
            {
                path: "/index",
                component: () => import ("@/views/index"),
                name: "Index",
                meta: { title: "首页", icon: "dashboard", affix: true },
            }, 
        ],
    },
    {
        path: "/chapter",
        component: Layout,
        meta: { title: "章节练习", icon: "swagger", noCache: true },
        children: [
            {
                path: "index",
                noCache: true,
                component: () => import ("@/views/chapter/index"),
                name: "chapter",
                meta: { title: "章节练习", icon: "swagger" },
            },
            {
                path: "answer",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/chapter/answer"),
                name: "chapterAnswer",
                meta: { title: "章节练习", icon: "swagger" },
            },
        ],
    },
    // {
    //     path: "/questionType",
    //     component: Layout,
    //     meta: { title: "题型练习", icon: "tree", noCache: true },
    //     children: [
    //         {
    //             path: "index",
    //             noCache: true,
    //             component: () => import ("@/views/questionType/index"),
    //             name: "questionType",
    //             meta: { title: "题型练习", icon: "tree" },
    //         },
    //         {
    //             path: "answer",
    //             noCache: true,
    //             hidden: true,
    //             component: () => import ("@/views/questionType/answer"),
    //             name: "questionTypeAnswer",
    //             meta: { title: "题型练习", icon: "tree" },
    //         },
    //     ],
    // },
    {
        path: "/today",
        component: Layout,
        meta: { title: "每日练习", icon: "edit", noCache: true },
        children: [
            {
                path: "index",
                noCache: true,
                component: () => import ("@/views/today/index"),
                name: "today",
                meta: { title: "每日练习", icon: "edit" },
            },
        ],
    },
    {
        path: "/realQuestion",
        component: Layout,
        meta: { title: "历年真题", icon: "edit", noCache: true },
        children: [
            {
                path: "index",
                noCache: true,
                component: () => import ("@/views/realQuestion/index"),
                name: "realQuestion",
                meta: { title: "历年真题", icon: "edit" },
            },
            {
                path: "detail",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/realQuestion/detail"),
                name: "realQuestionDetail",
                meta: { title: "历年真题", icon: "edit" },
            },
            {
                path: "answer",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/realQuestion/answer"),
                name: "realQuestionAnswer",
                meta: { title: "历年真题", icon: "edit" },
            },
        ],
    },
    {
        path: "/imitateQuestion",
        component: Layout,
        meta: { title: "模拟考试", icon: "edit", noCache: true },
        children: [
            {
                path: "index",
                noCache: true,
                component: () => import ("@/views/imitateQuestion/index"),
                name: "imitateQuestion",
                meta: { title: "模拟考试", icon: "edit" },
            },
            {
                path: "detail",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/imitateQuestion/detail"),
                name: "imitateQuestionDetail",
                meta: { title: "模拟考试", icon: "edit" },
            },
            {
                path: "answer",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/imitateQuestion/answer"),
                name: "imitateQuestionAnswer",
                meta: { title: "模拟考试", icon: "edit" },
            },
        ],
    },
    {
        path: "/errorQuestion",
        component: Layout,
        meta: { title: "错题巩固", icon: "log", noCache: true },
        children: [
            {
                path: "index",
                noCache: true,
                component: () => import ("@/views/errorQuestion/index"),
                name: "errorQuestion",
                meta: { title: "错题巩固", icon: "log" },
            },
            {
                path: "answer",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/errorQuestion/answer"),
                name: "errorQuestionAnswer",
                meta: { title: "错题巩固", icon: "log" },
            },
        ],
    },
    {
        path: "/myCollect",
        component: Layout,
        meta: { title: "我的收藏", icon: "rate", noCache: true },
        children: [
            {
                path: "index",
                noCache: true,
                component: () => import ("@/views/myCollect/index"),
                name: "myCollect",
                meta: { title: "我的收藏", icon: "rate" },
            },
            {
                path: "answer",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/myCollect/answer"),
                name: "myCollectAnswer",
                meta: { title: "我的收藏", icon: "rate" },
            },
        ],
    },
    {
        path: "/questionGuide",
        component: Layout,
        meta: { title: "考试指南", icon: "education", noCache: true },
        children: [
            {
                path: "index",
                noCache: true,
                component: () => import ("@/views/questionGuide/index"),
                name: "guide",
                meta: { title: "考试指南", icon: "education" },
            },
            {
                path: "detail",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/questionGuide/detail"),
                name: "guideDetail",
                meta: { title: "考试指南", icon: "education" },
            },
        ],
    },



    {
        path: "/questionAdmin/chapter",
        component: Layout,
        meta: { title: "章节练习管理", icon: "dict", noCache: true },
        children: [
            {
                path: "list",
                noCache: true,
                component: () => import ("@/views/questionAdmin/chapter/list"),
                name: "questionAdminChapterList",
                meta: { title: "章节练习管理", icon: "dict" },
            },
            {
                path: "add",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/questionAdmin/chapter/add"),
                name: "questionAdminAddChapter",
                meta: { title: "添加章节", icon: "dict" },
            },
            {
                path: "questionList",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/questionAdmin/chapter/questionList"),
                name: "questionAdminChapterQuestionList",
                meta: { title: "章节题目管理", icon: "dict" },
            },
            {
                path: "addQuestion",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/questionAdmin/chapter/addQuestion"),
                name: "questionAdminAddQuestion",
                meta: { title: "添加题目", icon: "dict" },
            },
        ],
    },
    {
        path: "/questionAdmin/guide",
        component: Layout,
        meta: { title: "考试指南管理", icon: "dict", noCache: true },
        children: [
            {
                path: "list",
                noCache: true,
                component: () => import ("@/views/questionAdmin/guide/list"),
                name: "questionAdminGuideList",
                meta: { title: "考试指南管理", icon: "dict" },
            },
            {
                path: "add",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/questionAdmin/guide/add"),
                name: "questionAdminAddGuide",
                meta: { title: "添加考试指南", icon: "dict" },
            },
        ],
    },
    {
        path: "/questionAdmin/special",
        component: Layout,
        meta: { title: "专题学习管理", icon: "dict", noCache: true },
        children: [
            {
                path: "list",
                noCache: true,
                component: () => import ("@/views/questionAdmin/special/list"),
                name: "questionAdminSpecialList",
                meta: { title: "专题学习管理", icon: "dict" },
            },
            {
                path: "add",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/questionAdmin/special/add"),
                name: "questionAdminAddSpecial",
                meta: { title: "添加专题", icon: "dict" },
            },
            {
                path: "specialList",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/questionAdmin/special/specialList"),
                name: "questionAdminSpecialSpecialList",
                meta: { title: "专题学习管理", icon: "dict" },
            },
            {
                path: "addSpecial",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/questionAdmin/special/addSpecial"),
                name: "questionAdminAddSpecialSpecial",
                meta: { title: "添加内容", icon: "dict" },
            },
        ],
    },
    


















    // {
    //     path: "/product",
    //     component: Layout,
    //     meta: { title: "产品管理", icon: "tree", noCache: true },
    //     children: [{
    //             path: "list",
    //             noCache: true,
    //             component: () =>
    //                 import ("@/views/product/list"),
    //             name: "productList",
    //             meta: { title: "产品管理", icon: "tree" },
    //         },
    //         {
    //             path: 'add',
    //             hidden: true,
    //             component: () =>
    //                 import ('@/views/product/add'),
    //             name: 'addProduct',
    //             meta: { title: '添加产品', icon: 'tree' }
    //         },
    //         {
    //             path: "cityList",
    //             hidden: true,
    //             component: () =>
    //                 import ("@/views/product/cityList"),
    //             name: "cityList",
    //             meta: { title: "已配置城市列表", icon: "tree" },
    //         },
    //         {
    //             path: "addCity",
    //             hidden: true,
    //             component: () =>
    //                 import ("@/views/product/addCity"),
    //             name: "addCity",
    //             meta: { title: "产品城市配置", icon: "tree" },
    //         },
    //     ],
    // },
    // {
    //     path: "/productTag",
    //     component: Layout,
    //     meta: { title: "产品标签管理", icon: "tree", noCache: true },
    //     children: [{
    //             path: "list",
    //             noCache: true,
    //             component: () =>
    //                 import ("@/views/productTag/list"),
    //             name: "productTagList",
    //             meta: { title: "产品标签管理", icon: "tree" },
    //         },
    //         {
    //             path: 'add',
    //             hidden: true,
    //             noCache: true,
    //             component: () =>
    //                 import ('@/views/productTag/add'),
    //             name: 'addProductTag',
    //             meta: { title: '添加产品标签', icon: 'tree' }
    //         },
    //     ],
    // },
    // {
    //     path: "/article",
    //     component: Layout,
    //     alwaysShow: true,
    //     meta: { title: "文章管理", icon: "tree", noCache: true },
    //     children: [{
    //             path: "list",
    //             noCache: true,
    //             component: () =>
    //                 import ("@/views/article/list"),
    //             name: "articleList",
    //             meta: { title: "文章管理", icon: "tree" },
    //         },
    //         {
    //             path: 'add',
    //             hidden: true,
    //             component: () =>
    //                 import ('@/views/article/add'),
    //             name: 'addArticle',
    //             meta: { title: '编辑文章', icon: 'tree' }
    //         },
    //         {
    //             path: "syncList",
    //             component: () =>
    //                 import ("@/views/article/syncList"),
    //             name: "syncList",
    //             meta: { title: "文章同步列表", icon: "tree" },
    //         },
    //         {
    //             path: "addSync",
    //             hidden: true,
    //             component: () =>
    //                 import ("@/views/article/addSync"),
    //             name: "addSync",
    //             meta: { title: "文章同步配置", icon: "tree" },
    //         },
    //     ],
    // },
    // {
    //     path: "/channel",
    //     component: Layout,
    //     meta: { title: "金融机构管理", icon: "tree", noCache: true },
    //     children: [{
    //             path: "list",
    //             noCache: true,
    //             component: () =>
    //                 import ("@/views/channel/list"),
    //             name: "channelList",
    //             meta: { title: "金融机构管理", icon: "tree" },
    //         },
    //         {
    //             path: 'add',
    //             hidden: true,
    //             noCache: true,
    //             component: () =>
    //                 import ('@/views/channel/add'),
    //             name: 'addChannel',
    //             meta: { title: '添加金融机构', icon: 'tree' }
    //         },
    //     ],
    // },
    // {
    //     path: "/operateCity",
    //     component: Layout,
    //     meta: { title: "城市管理", icon: "tree", noCache: true },
    //     children: [{
    //             path: "list",
    //             noCache: true,
    //             component: () =>
    //                 import ("@/views/operateCity/list"),
    //             name: "operateCityList",
    //             meta: { title: "城市管理", icon: "tree" },
    //         },
    //         {
    //             path: 'add',
    //             hidden: true,
    //             noCache: true,
    //             component: () =>
    //                 import ('@/views/operateCity/add'),
    //             name: 'addOperateCity',
    //             meta: { title: '添加城市', icon: 'tree' }
    //         },
    //     ],
    // },
    // {
    //     path: "/system",
    //     component: Layout,
    //     alwaysShow: true,
    //     meta: { title: "系统管理", icon: "tree", noCache: true },
    //     children: [{
    //             path: "index",
    //             noCache: true,
    //             component: () =>
    //                 import ("@/views/system/index"),
    //             name: "systemIndex",
    //             meta: { title: "平台信息设置", icon: "tree" },
    //         },
    //         {
    //             path: "advertList",
    //             noCache: true,
    //             component: () =>
    //                 import ("@/views/system/advert/list"),
    //             name: "advertList",
    //             meta: { title: "广告管理", icon: "tree" },
    //         },
    //         {
    //             path: 'addAdvert',
    //             hidden: true,
    //             component: () =>
    //                 import ('@/views/system/advert/add'),
    //             name: 'addAdvert',
    //             meta: { title: '广告编辑', icon: 'tree' }
    //         },
    //         {
    //             path: "bannerList",
    //             component: () =>
    //                 import ("@/views/system/banner/list"),
    //             name: "bannerList",
    //             meta: { title: "首页轮播管理", icon: "tree" },
    //         },
    //         {
    //             path: "addBanner",
    //             hidden: true,
    //             component: () =>
    //                 import ("@/views/system/banner/add"),
    //             name: "addBanner",
    //             meta: { title: "首页轮播编辑", icon: "tree" },
    //         },
    //     ],
    // },
]