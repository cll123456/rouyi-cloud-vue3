[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=cll123456&repo=rouyi-cloud-vue3)](https://github.com/anuraghazra/github-readme-stats)

# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

```
RuoYi-Cloud-Vue3
├─ .eslintignore
├─ .eslintrc.js
├─ .gitignore
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ assets
│  │  ├─ code.png
│  │  ├─ pic1.png
│  │  ├─ pic2.png
│  │  ├─ pic3.png
│  │  ├─ pic4.png
│  │  └─ task.png
│  ├─ guide
│  │  └─ start.md
│  └─ index.md
├─ index.html
├─ package.json
├─ public
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ api
│  │  ├─ login.js
│  │  ├─ menu.js
│  │  ├─ monitor
│  │  │  ├─ cache.js
│  │  │  ├─ job.js
│  │  │  ├─ jobLog.js
│  │  │  ├─ logininfor.js
│  │  │  ├─ online.js
│  │  │  ├─ operlog.js
│  │  │  └─ server.js
│  │  ├─ system
│  │  │  ├─ config.js
│  │  │  ├─ dept.js
│  │  │  ├─ dict
│  │  │  │  ├─ data.js
│  │  │  │  └─ type.js
│  │  │  ├─ menu.js
│  │  │  ├─ notice.js
│  │  │  ├─ post.js
│  │  │  ├─ role.js
│  │  │  └─ user.js
│  │  └─ tool
│  │     └─ gen.js
│  ├─ App.vue
│  ├─ assets
│  │  ├─ 401_images
│  │  │  └─ 401.gif
│  │  ├─ 404_images
│  │  │  ├─ 404.png
│  │  │  └─ 404_cloud.png
│  │  ├─ icons
│  │  │  ├─ svg
│  │  │  │  ├─ 404.svg
│  │  │  │  ├─ bug.svg
│  │  │  │  ├─ build.svg
│  │  │  │  ├─ button.svg
│  │  │  │  ├─ cascader.svg
│  │  │  │  ├─ chart.svg
│  │  │  │  ├─ checkbox.svg
│  │  │  │  ├─ client.svg
│  │  │  │  ├─ clipboard.svg
│  │  │  │  ├─ code.svg
│  │  │  │  ├─ color.svg
│  │  │  │  ├─ component.svg
│  │  │  │  ├─ dashboard.svg
│  │  │  │  ├─ date-range.svg
│  │  │  │  ├─ date.svg
│  │  │  │  ├─ dict.svg
│  │  │  │  ├─ documentation.svg
│  │  │  │  ├─ download.svg
│  │  │  │  ├─ drag.svg
│  │  │  │  ├─ druid.svg
│  │  │  │  ├─ edit.svg
│  │  │  │  ├─ education.svg
│  │  │  │  ├─ email.svg
│  │  │  │  ├─ example.svg
│  │  │  │  ├─ excel.svg
│  │  │  │  ├─ exit-fullscreen.svg
│  │  │  │  ├─ eye-open.svg
│  │  │  │  ├─ eye.svg
│  │  │  │  ├─ form.svg
│  │  │  │  ├─ fullscreen.svg
│  │  │  │  ├─ github.svg
│  │  │  │  ├─ guide.svg
│  │  │  │  ├─ icon.svg
│  │  │  │  ├─ input.svg
│  │  │  │  ├─ international.svg
│  │  │  │  ├─ job.svg
│  │  │  │  ├─ language.svg
│  │  │  │  ├─ link.svg
│  │  │  │  ├─ list.svg
│  │  │  │  ├─ lock.svg
│  │  │  │  ├─ log.svg
│  │  │  │  ├─ logininfor.svg
│  │  │  │  ├─ message.svg
│  │  │  │  ├─ money.svg
│  │  │  │  ├─ monitor.svg
│  │  │  │  ├─ nacos.svg
│  │  │  │  ├─ nested.svg
│  │  │  │  ├─ number.svg
│  │  │  │  ├─ online.svg
│  │  │  │  ├─ password.svg
│  │  │  │  ├─ pdf.svg
│  │  │  │  ├─ people.svg
│  │  │  │  ├─ peoples.svg
│  │  │  │  ├─ phone.svg
│  │  │  │  ├─ post.svg
│  │  │  │  ├─ qq.svg
│  │  │  │  ├─ question.svg
│  │  │  │  ├─ radio.svg
│  │  │  │  ├─ rate.svg
│  │  │  │  ├─ redis.svg
│  │  │  │  ├─ row.svg
│  │  │  │  ├─ search.svg
│  │  │  │  ├─ select.svg
│  │  │  │  ├─ sentinel.svg
│  │  │  │  ├─ server.svg
│  │  │  │  ├─ shopping.svg
│  │  │  │  ├─ size.svg
│  │  │  │  ├─ skill.svg
│  │  │  │  ├─ slider.svg
│  │  │  │  ├─ star.svg
│  │  │  │  ├─ swagger.svg
│  │  │  │  ├─ switch.svg
│  │  │  │  ├─ system.svg
│  │  │  │  ├─ tab.svg
│  │  │  │  ├─ table.svg
│  │  │  │  ├─ textarea.svg
│  │  │  │  ├─ theme.svg
│  │  │  │  ├─ time-range.svg
│  │  │  │  ├─ time.svg
│  │  │  │  ├─ tool.svg
│  │  │  │  ├─ tree-table.svg
│  │  │  │  ├─ tree.svg
│  │  │  │  ├─ upload.svg
│  │  │  │  ├─ user.svg
│  │  │  │  ├─ validCode.svg
│  │  │  │  ├─ wechat.svg
│  │  │  │  └─ zip.svg
│  │  │  └─ svgo.yml
│  │  ├─ images
│  │  │  ├─ customSlidePic.jpg
│  │  │  ├─ dark.svg
│  │  │  ├─ element-plus-pic.png
│  │  │  ├─ light.svg
│  │  │  ├─ login-background.jpg
│  │  │  ├─ profile.jpg
│  │  │  └─ ruoyi-pic.png
│  │  ├─ logo
│  │  │  └─ logo.png
│  │  └─ styles
│  │     ├─ btn.scss
│  │     ├─ element-ui.scss
│  │     ├─ index.scss
│  │     ├─ mixin.scss
│  │     ├─ ruoyi.scss
│  │     ├─ sidebar.scss
│  │     ├─ transition.scss
│  │     └─ variables.module.scss
│  ├─ components
│  │  ├─ Breadcrumb
│  │  │  └─ index.vue
│  │  ├─ DictTag
│  │  │  └─ index.vue
│  │  ├─ Hamburger
│  │  │  └─ index.vue
│  │  ├─ HeaderSearch
│  │  │  └─ index.vue
│  │  ├─ IconSelect
│  │  │  └─ index.vue
│  │  ├─ IframeComp
│  │  │  └─ index.vue
│  │  ├─ Pagination
│  │  │  └─ index.vue
│  │  ├─ ParentView
│  │  │  └─ index.vue
│  │  ├─ RightToolbar
│  │  │  └─ index.vue
│  │  ├─ Ruoyi
│  │  │  ├─ Doc
│  │  │  │  └─ index.vue
│  │  │  └─ Git
│  │  │     └─ index.vue
│  │  ├─ Screenfull
│  │  │  └─ index.vue
│  │  ├─ SizeSelect
│  │  │  └─ index.vue
│  │  ├─ SvgIcon
│  │  │  └─ index.vue
│  │  └─ TreeSelect
│  │     └─ index.vue
│  ├─ config
│  │  ├─ commonConfig.js
│  │  └─ settings.js
│  ├─ directives
│  │  ├─ hasPermi.js
│  │  └─ index.js
│  ├─ hooks
│  │  ├─ dict.js
│  │  └─ dynamicTitle.js
│  ├─ layout
│  │  ├─ components
│  │  │  ├─ AppMain.vue
│  │  │  ├─ Navbar
│  │  │  │  └─ index.vue
│  │  │  ├─ Settings
│  │  │  │  └─ index.vue
│  │  │  ├─ Sidebar
│  │  │  │  ├─ index.vue
│  │  │  │  ├─ Link.vue
│  │  │  │  ├─ Logo.vue
│  │  │  │  └─ SidebarItem.vue
│  │  │  └─ tagsView
│  │  │     ├─ index.vue
│  │  │     └─ ScrollPane.vue
│  │  └─ index.vue
│  ├─ main.js
│  ├─ permission.js
│  ├─ router
│  │  └─ index.js
│  ├─ store
│  │  ├─ getter.js
│  │  ├─ index.js
│  │  └─ modules
│  │     ├─ app.js
│  │     ├─ permission.js
│  │     ├─ settings.js
│  │     ├─ tagsView.js
│  │     └─ user.js
│  ├─ utils
│  │  ├─ auth.js
│  │  ├─ color.js
│  │  ├─ errorCode.js
│  │  ├─ jsencrypt.js
│  │  ├─ permission.js
│  │  ├─ request.js
│  │  ├─ ruoyi.js
│  │  └─ validate.js
│  └─ views
│     ├─ error
│     │  ├─ 401.vue
│     │  └─ 404.vue
│     ├─ index
│     │  └─ index.vue
│     ├─ login
│     │  └─ index.vue
│     ├─ monitor
│     │  ├─ cache
│     │  │  └─ index.vue
│     │  ├─ druid
│     │  │  └─ index.vue
│     │  ├─ job
│     │  │  ├─ index.vue
│     │  │  └─ log.vue
│     │  ├─ logininfor
│     │  │  └─ index.vue
│     │  ├─ online
│     │  │  └─ index.vue
│     │  ├─ operlog
│     │  │  └─ index.vue
│     │  └─ server
│     │     └─ index.vue
│     ├─ redirect
│     │  └─ index.vue
│     ├─ system
│     │  ├─ config
│     │  │  └─ index.vue
│     │  ├─ dept
│     │  │  └─ index.vue
│     │  ├─ dict
│     │  │  ├─ data.vue
│     │  │  └─ index.vue
│     │  ├─ menu
│     │  │  └─ index.vue
│     │  ├─ notice
│     │  │  └─ index.vue
│     │  ├─ post
│     │  │  └─ index.vue
│     │  ├─ role
│     │  │  ├─ authUser.vue
│     │  │  ├─ index.vue
│     │  │  └─ selectUser.vue
│     │  └─ user
│     │     ├─ authRole.vue
│     │     ├─ index.vue
│     │     └─ profile
│     │        ├─ index.vue
│     │        ├─ resetPwd.vue
│     │        ├─ userAvatar.vue
│     │        └─ userInfo.vue
│     └─ tool
│        ├─ build
│        │  ├─ CodeTypeDialog.vue
│        │  ├─ DraggableItem.vue
│        │  ├─ IconsDialog.vue
│        │  ├─ index.vue
│        │  ├─ RightPanel.vue
│        │  └─ TreeNodeDialog.vue
│        ├─ gen
│        │  ├─ basicInfoForm.vue
│        │  ├─ editTable.vue
│        │  ├─ genInfoForm.vue
│        │  ├─ importTable.vue
│        │  └─ index.vue
│        └─ swagger
│           └─ index.vue
├─ vite.config.js
├─ yarn-error.log
└─ yarn.lock

```