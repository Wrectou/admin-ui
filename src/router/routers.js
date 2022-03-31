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
        meta: { title: "章节练习", icon: "tree", noCache: true },
        children: [
            {
                path: "index",
                noCache: true,
                component: () => import ("@/views/chapter/index"),
                name: "chapter",
                meta: { title: "章节练习", icon: "tree" },
            },
            {
                path: "answer",
                noCache: true,
                hidden: true,
                component: () => import ("@/views/chapter/answer"),
                name: "answer",
                meta: { title: "回答单选", icon: "tree" },
            },
        ],
    },
    {
        path: "/questionType",
        component: Layout,
        meta: { title: "题型练习", icon: "tree", noCache: true },
        children: [
            {
                path: "index",
                noCache: true,
                component: () => import ("@/views/questionType/index"),
                name: "questionType",
                meta: { title: "题型练习", icon: "tree" },
            },
            {
                path: "single",
                noCache: true,
                component: () => import ("@/views/questionType/single"),
                name: "single",
                meta: { title: "单项选择题型", icon: "tree" },
            },
            {
                path: "several",
                noCache: true,
                component: () => import ("@/views/questionType/several"),
                name: "several",
                meta: { title: "多项选择题型", icon: "tree" },
            },
            {
                path: "judge",
                noCache: true,
                component: () => import ("@/views/questionType/judge"),
                name: "judge",
                meta: { title: "判断题型", icon: "tree" },
            },
            {
                path: "discuss",
                noCache: true,
                component: () => import ("@/views/questionType/discuss"),
                name: "discuss",
                meta: { title: "论述题型", icon: "tree" },
            },
        ],
    },
    {
        path: "/product",
        component: Layout,
        meta: { title: "产品管理", icon: "tree", noCache: true },
        children: [{
                path: "list",
                noCache: true,
                component: () =>
                    import ("@/views/product/list"),
                name: "productList",
                meta: { title: "产品管理", icon: "tree" },
            },
            {
                path: 'add',
                hidden: true,
                component: () =>
                    import ('@/views/product/add'),
                name: 'addProduct',
                meta: { title: '添加产品', icon: 'tree' }
            },
            {
                path: "cityList",
                hidden: true,
                component: () =>
                    import ("@/views/product/cityList"),
                name: "cityList",
                meta: { title: "已配置城市列表", icon: "tree" },
            },
            {
                path: "addCity",
                hidden: true,
                component: () =>
                    import ("@/views/product/addCity"),
                name: "addCity",
                meta: { title: "产品城市配置", icon: "tree" },
            },
        ],
    },
    {
        path: "/productTag",
        component: Layout,
        meta: { title: "产品标签管理", icon: "tree", noCache: true },
        children: [{
                path: "list",
                noCache: true,
                component: () =>
                    import ("@/views/productTag/list"),
                name: "productTagList",
                meta: { title: "产品标签管理", icon: "tree" },
            },
            {
                path: 'add',
                hidden: true,
                noCache: true,
                component: () =>
                    import ('@/views/productTag/add'),
                name: 'addProductTag',
                meta: { title: '添加产品标签', icon: 'tree' }
            },
        ],
    },
    {
        path: "/article",
        component: Layout,
        alwaysShow: true,
        meta: { title: "文章管理", icon: "tree", noCache: true },
        children: [{
                path: "list",
                noCache: true,
                component: () =>
                    import ("@/views/article/list"),
                name: "articleList",
                meta: { title: "文章管理", icon: "tree" },
            },
            {
                path: 'add',
                hidden: true,
                component: () =>
                    import ('@/views/article/add'),
                name: 'addArticle',
                meta: { title: '编辑文章', icon: 'tree' }
            },
            {
                path: "syncList",
                component: () =>
                    import ("@/views/article/syncList"),
                name: "syncList",
                meta: { title: "文章同步列表", icon: "tree" },
            },
            {
                path: "addSync",
                hidden: true,
                component: () =>
                    import ("@/views/article/addSync"),
                name: "addSync",
                meta: { title: "文章同步配置", icon: "tree" },
            },
        ],
    },
    {
        path: "/channel",
        component: Layout,
        meta: { title: "金融机构管理", icon: "tree", noCache: true },
        children: [{
                path: "list",
                noCache: true,
                component: () =>
                    import ("@/views/channel/list"),
                name: "channelList",
                meta: { title: "金融机构管理", icon: "tree" },
            },
            {
                path: 'add',
                hidden: true,
                noCache: true,
                component: () =>
                    import ('@/views/channel/add'),
                name: 'addChannel',
                meta: { title: '添加金融机构', icon: 'tree' }
            },
        ],
    },
    {
        path: "/operateCity",
        component: Layout,
        meta: { title: "城市管理", icon: "tree", noCache: true },
        children: [{
                path: "list",
                noCache: true,
                component: () =>
                    import ("@/views/operateCity/list"),
                name: "operateCityList",
                meta: { title: "城市管理", icon: "tree" },
            },
            {
                path: 'add',
                hidden: true,
                noCache: true,
                component: () =>
                    import ('@/views/operateCity/add'),
                name: 'addOperateCity',
                meta: { title: '添加城市', icon: 'tree' }
            },
        ],
    },
    {
        path: "/system",
        component: Layout,
        alwaysShow: true,
        meta: { title: "系统管理", icon: "tree", noCache: true },
        children: [{
                path: "index",
                noCache: true,
                component: () =>
                    import ("@/views/system/index"),
                name: "systemIndex",
                meta: { title: "平台信息设置", icon: "tree" },
            },
            {
                path: "advertList",
                noCache: true,
                component: () =>
                    import ("@/views/system/advert/list"),
                name: "advertList",
                meta: { title: "广告管理", icon: "tree" },
            },
            {
                path: 'addAdvert',
                hidden: true,
                component: () =>
                    import ('@/views/system/advert/add'),
                name: 'addAdvert',
                meta: { title: '广告编辑', icon: 'tree' }
            },
            {
                path: "bannerList",
                component: () =>
                    import ("@/views/system/banner/list"),
                name: "bannerList",
                meta: { title: "首页轮播管理", icon: "tree" },
            },
            {
                path: "addBanner",
                hidden: true,
                component: () =>
                    import ("@/views/system/banner/add"),
                name: "addBanner",
                meta: { title: "首页轮播编辑", icon: "tree" },
            },
        ],
    },
    {
        path: "/order",
        component: Layout,
        meta: { title: "订单管理", icon: "tree", noCache: true },
        children: [{
                path: "index",
                noCache: true,
                component: () =>
                    import ("@/views/order/index"),
                name: "orderindex",
                meta: { title: "订单管理", icon: "tree" },
            },
            {
                path: "particulars",
                hidden: true,
                component: () =>
                    import ("@/views/order/particulars"),
                name: "orderparticulars",
                meta: { title: "订单详情", icon: "tree" },
            }

        ],
    }, {
        path: "/solution",
        component: Layout,
        meta: { title: "资金解决方案", icon: "tree", noCache: true },
        children: [{
                path: "index",
                noCache: true,
                component: () =>
                    import ("@/views/solution/index"),
                name: "solutionindex",
                meta: { title: "资金解决方案", icon: "tree" },
            }, {
                path: "cityconfiguration",
                hidden: true,
                component: () =>
                    import ("@/views/solution/cityconfiguration"),
                name: "cityconfiguration",
                meta: { title: "城市配置", icon: "tree" },
            }


        ],
    },

]