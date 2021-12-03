[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=cll123456&repo=rouyi-cloud-vue3)](https://github.com/anuraghazra/github-readme-stats)


#  VUE3 JS 后台管理系统
本项目是基于Vue3.2.20+ element-plus等前端和若依的后端开发的一套后台管理系统，目标是开箱即用、提供丰富的组件。目前已经上了项目的1.0 版本。项目演示地址：http://ruoyi.chenliangliang.top/

# 使用方式
请查看该项目的文档： http://ruoyi-doc.chenliangliang.top/

# 目前状况
当前分支只提供`最简单`的`权限管理`，`系统管理`等，方便需要的同学去使用。后面会单独开发有用的组件库，方便大家去使用，欢迎大家star 

# 代码风格

```js
<script setup>
import { ref } from 'vue';
const url = ref('xxxx');

/**
 * 跳转到gitUp页面
 */
const goto = () => {
  window.open(url.value)
}
</script>
<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<style lang='scss' scoped>
</style>
```

#  实现效果


![效果1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc1d6b27786d4c2488e2ac906213c3dc~tplv-k3u1fbpfcp-watermark.awebp)![效果2](http://ruoyi-doc.chenliangliang.top/assets/pic2.7cba0db8.png)![效果3](http://ruoyi-doc.chenliangliang.top/assets/pic3.5f0b6e9d.png)![效果4](http://ruoyi-doc.chenliangliang.top/assets/pic4.382d40d4.png)
