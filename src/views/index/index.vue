<script>
export default {
  name: 'Index'
}
</script>
<script setup>
import { ref } from '@vue/composition-api';


const tags = ref(['primary', 'success', 'info', 'warning', 'danger'])

// 快捷入口
const links = ref([
  { title: 'Vue3', href: 'https://v3.cn.vuejs.org/' },
  { title: 'Element-Plus', href: 'https://element-plus.gitee.io/zh-CN/guide/design.html' },
  { title: 'axios', href: 'http://www.axios-js.com/' },
  { title: 'Vite', href: 'https://vitejs.dev/guide/' },
  { title: 'vueuse', href: 'https://vueuse.org/' },
  { title: 'sass', href: 'https://www.sass.hk/' },
  { title: 'echarts', href: 'https://echarts.apache.org/zh/index.html' },
])
/**
 * 跳转页面
 */
const goToPage = (url) => {
  window.open(url, '__blank')
}

</script>
<template>
  <div class="app-container">
    <el-row>
      <el-col :span="16">
        <!-- 致谢 -->
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>致谢</span>
            </div>
          </template>
          <el-row :gutter="2">
            <el-col :span="8">
              <el-card shadow="hover">
                <div class="card-title">
                  <img src="./../../assets/images/ruoyi-pic.png" />
                  <el-link type="primary" :underline="false">RuoYi-Vue</el-link>
                </div>
                <div class="content">基于SpringBoot，Spring Security，JWT，Vue & Element 的前后端分离权限管理系统。</div>
                <div class="footer">
                  <el-link :underline="false" href="http://doc.ruoyi.vip/">官 网</el-link>
                  <el-link :underline="false" href="https://gitee.com/y_project/RuoYi-Vue">
                    源 码
                    <i class="el-icon-view el-icon--right"></i>
                  </el-link>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <div class="card-title">
                  <img
                    class="logo"
                    src="./../../assets/images/element-plus-pic.png"
                    alt="Elemenet Plus Logo"
                    data-v-385ae080
                  />
                  <el-link type="primary" :underline="false">Element-Plus</el-link>
                </div>
                <div class="content">Elment 的升级版，原班人马重新为Vue3打造的企业级别UI框架。</div>
                <div class="footer">
                  <el-link
                    :underline="false"
                    href="https://element-plus.gitee.io/zh-CN/guide/design.html"
                  >官 网</el-link>
                  <el-link :underline="false" href="https://github.com/element-plus/element-plus">
                    源 码
                    <i class="el-icon-view el-icon--right"></i>
                  </el-link>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <div class="card-title">
                  <img src="https://static.vue-js.com/6280b990-ff19-11ea-85f6-6fac77c0c9b3.png" />
                  <el-link type="primary" :underline="false">Vue-3.2.20</el-link>
                </div>
                <div class="content">Vue2的升级,script setup 函数的最终实践。</div>
                <div class="footer">
                  <el-link :underline="false" href="https://v3.cn.vuejs.org/">官 网</el-link>
                  <el-link :underline="false" href="https://github.com/vuejs/vue">
                    源 码
                    <i class="el-icon-view el-icon--right"></i>
                  </el-link>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
        <el-divider></el-divider>
        <!-- 项目简介 -->
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>RuoYi-Vue3-Js 简介</span>
            </div>
          </template>
          <div class="content">
            <span style="font-weight: bold;">RuoYi-Vue3-Js</span> 是以RuoYi 中的spring-clound来作为后端。以Vue3.2.20， vite, vueuse,
            scss等来构建前端的。
            <p
              style="margin: 5px 0;"
            >项目高度还原了若依的功能，使用方式，总共实现了以下功能：拥有用户管理、部门管理、岗位管理、菜单管理、角色管理、字典管理、参数管理、通知公告、操作日志、登录日志等功能。</p>
            <address>
              由于某些原因，现在的代码生成和表单构建没有完成
              <span style="color: lightcoral;">后期会与若依保持一致</span>
            </address>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="card-box" style="padding-right: 0px;">
        <!-- 涉及技术便捷入口 -->
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>涉及技术便捷入口</span>
            </div>
          </template>
          <div class="content" style="height: auto;">
            <template>
              <el-button
                v-for="(item,index) in links"
                :key="item.title"
                @click="goToPage(item.href)"
                plain
                class="tags-style"
                :type="tags[index % tags.length]"
              >{{ item.title }}</el-button>
            </template>
          </div>
        </el-card>
        <el-divider></el-divider>
        <!-- gitup项目展示 -->
        <a class="img-pro--container" href="https://github.com/cll123456/rouyi-cloud-vue3">
          <img
            src="https://camo.githubusercontent.com/e15ae1323307f9d5429b354629acc5865b8e39cd70eddc66400f4bd3a18501c0/68747470733a2f2f6769746875622d726561646d652d73746174732e76657263656c2e6170702f6170692f70696e2f3f757365726e616d653d636c6c313233343536267265706f3d726f7579692d636c6f75642d76756533"
          />
        </a>
        <el-divider></el-divider>
        <!-- 贡献者 -->
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>贡献者</span>
            </div>
          </template>
          <div class="content _flex">
            <div class="card-title person">
              <img src="https://avatars.githubusercontent.com/u/41314419?s=48&v=4" />
              <el-link type="primary" :underline="false" href="https://github.com/cll123456">twinkle</el-link>
            </div>
            <div class="card-title person">
              <img src="https://avatars.githubusercontent.com/u/44079368?v=4" />
              <el-link type="primary" :underline="false" href="https://github.com/DearWQ">DearWQ</el-link>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang='scss' scoped>
.box-card {
  :deep(.el-card__header) {
    padding: 14px 15px 7px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    img {
      height: 24px;
      vertical-align: middle;
    }
  }

  .person {
    justify-content: start;
    cursor: pointer;

    img {
      height: 40px;
      vertical-align: middle;
      border-radius: 50%;
      margin-right: 10px;
    }
  }

  .content {
    color: rgba(0, 0, 0, 0.45);
    height: 66px;
    line-height: 20px;
    font-size: 14px;
    margin-bottom: 20px;

    .tags-style {
      margin: 5px;
      font-size: 16px;
      cursor: pointer;
    }
  }
  ._flex {
    height: auto;
    display: flex;
    justify-content: space-around;
  }
  .footer {
    display: flex;
    justify-content: space-between;
  }
}

.img-pro--container {
  cursor: pointer;

  img {
    width: 100%;
  }
}
</style>