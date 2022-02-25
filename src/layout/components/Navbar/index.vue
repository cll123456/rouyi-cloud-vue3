<script setup>
import { useStore } from "vuex"
import { ElMessageBox, ElMessage } from 'element-plus'
import { computed } from 'vue'
import RuoYiGit from './../../../components/Ruoyi/Git/index.vue'
import RuoYiDoc from './../../../components/Ruoyi/Doc/index.vue'
import Screenfull from './../../../components/Screenfull/index.vue'
import avatar from './../../../assets/images/profile.jpg'
import SizeSelect from './../../../components/SizeSelect/index.vue'
import { CaretBottom } from '@element-plus/icons-vue'
import Hamburger from './../../../components/Hamburger/index.vue'
import Breadcrumb from './../../../components/Breadcrumb/index.vue'
import HeaderSearch from './../../../components/HeaderSearch/index.vue'

/**
 * 仓库对象
 */
const store = useStore();

/**
 * getter 数据
 */
const getterData = computed(() => store.getters);

const emits = defineEmits(['settingLayout'])
/**
 * 打开或者折叠左侧菜单
 */
const toggleSideBar = () => {
  store.dispatch('app/toggleSideBar')
}

/**
 * 退出登录
 */
const logout = () => {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.dispatch('LogOut').then(() => {
      ElMessage({
        type: 'success',
        message: '退出成功！',
      })
      location.href = '/index';
    })
  }).catch(() => { });
}

/**
 * 打开设置
 */
const settingLayout = () => {
  emits('settingLayout');
}
</script>
<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="getterData.sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!getterData.topNav" />
    <!-- <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" /> -->

    <div class="right-menu">
      <template v-if="getterData.device !== 'mobile'">
        <header-search id="header-search" class="right-menu-item" />

        <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="是否全屏" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>
        <!-- 当前布局大小设置组件 -->
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <div class="avatar-container">
        <el-dropdown class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar" />
            <el-icon>
              <caret-bottom />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item @click.native="settingLayout">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
