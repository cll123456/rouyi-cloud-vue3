---
sidebarDepth: 2
---

# 目录结构

> 本项目的主要目录如下
```
RuoYi-Vue3                                      # 项目名称
├─ .eslintignore                                # eslint 忽视检查文件
├─ .eslintrc.js                                 # eslint 配置文件
├─ .gitignore                                   # git 忽视提交文件
├─ docs                                         # 文档
│  ├─ .vitepress                                # 使用vitepress的配置文件
│  │  └─ config.js 
│  ├─ assets                                    # 文档静态资源
│  └─ index.md                                  # 文档入口
├─ index.html                                   # vue 项目的主要入口
├─ package.json                                 #项目依赖文件
├─ public                                       # 项目忽略打包的目录
├─ src                                          # 主要代码存放目录
│  ├─ api                                       # api 层存放目录
│  ├─ App.vue                                   # 项目根节点目录
│  ├─ assets                                    # 项目静态资源存放目录
│  ├─ components                                # 组件目录
│  ├─ config                                    # 全局配置文件
│  │  ├─ commonConfig.js                        # 项目公共配置
│  │  └─ settings.js                            # 系统外观配置
│  ├─ directives                                # 自定义指令
│  │  ├─ hasPermi.js                            # 是否拥有权限
│  │  └─ index.js
│  ├─ hooks                                     # 系统钩子
│  │  ├─ dict.js                                # 获取字典的公共钩子
│  │  └─ dynamicTitle.js                        # 动态网站标题的钩子
│  ├─ layout                                    # 布局目录
│  │  ├─ components                             # 布局组件
│  │  └─ index.vue                              # 布局入口
│  ├─ main.js                                   # 项目入口
│  ├─ permission.js                             # 全局路由守卫，动态导入路由
│  ├─ router                                    # 路由目录
│  │  └─ index.js
│  ├─ store                                     # vuex 仓库
│  ├─ utils                                     # 辅助函数文件
│  └─ views                                     # 页面目录
└─ vite.config.js                               #vite 配置文件
```