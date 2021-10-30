module.exports = {
    title: "RuoYi-Vue3-JS Doc", // 顶部左侧标题
    base: "", // 项目的根路径
    head: [
        // 设置 描述 和 关键词
        [
            "meta",
            {name: "keywords", content: "vue3 vue-element-plus-admin admin 后台管理系统"},
        ],
        [
            "meta",
            {
                name: "description",
                content:
                    "此框架使用与二次开发，后台使用若依的后台。前端框架使用Vue3，UI框架使用element-plus，全局数据状态管理使用vuex，ajax使用库为axios。用于快速搭建中后台页面。",
            },
        ],
    ],
    themeConfig: {
        repo: 'cll123456/rouyi-cloud-vue3',
        editLinks: true,
        editLinkText: '更新内容',
        lastUpdated: '上次修改',
        sidebar: {
            // 侧边栏
            "/": [
                {
                    text: "介绍",
                    children: [
                        {text: "什么是RuoYi-Vue3-JS", link: "/"},
                        {text: "开始使用", link: "/guide/start"},
                    ],
                }, {
                    text: "项目分析",
                    children: [
                        {
                            text: '目录分析',
                            link: '/guide/dialog'
                        },
                        {
                            text: '依赖分析',
                            link: '/guide/dependence'
                        }
                    ]
                }, {
                    text: '更新记录',
                    link: '/guide/log',
                }
            ],
        },
        nav: [
            // 顶部右侧导航栏
            {text: "介绍", link: "/", activeMatch: "^/$|^/guide/"},
            {
                text: "预览地址",
                link: "http://ruoyi.chenliangliang.top",
            },

        ],
    },
};