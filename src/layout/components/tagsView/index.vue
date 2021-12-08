<script setup>
import { ref, computed, getCurrentInstance, nextTick, onMounted, watch, watchEffect } from '@vue/composition-api'
import store from '@/store';
import router from '@/router';
import { getNormalPath } from '../../../utils/ruoyi';
import scrollPane from './ScrollPane.vue';


/**
 * 是否右键打开菜单选项  
 */
const visible = ref(false);
/**
 * 获取当前的实例
 */
const { proxy } = getCurrentInstance();

/**
 * 右键菜单距离顶部距离
 */
const top = ref(0);
/**
 * 右键菜单左侧距离
 */
const left = ref(0);
/**
 * 当前选中的tag对象，一个路由对象
 */
const selectedTag = ref({});
/**
 * 固定的affixTags数组，路由对象数组
 */
const affixTags = ref([]);

/**
 * 当前需要展示的tags
 */
const visitedViews = computed(() => store.state.tagsView.visitedViews);
/**
 * 获取当前权限路由，用于点击后展示到tags上
 */
const routes = computed(() => store.state.permission.routes);

/**
 * scrollPane 的dom
 */
const scrollPaneRef = ref(null);
/**
 * 获取当前主题
 */
const theme = computed(() => store.state.settings.theme);

/**
 * 锁定是否需要添加flag,用于删除也会
 */
const lockFlag = ref(false);
/**
 * 当前选中的tag
 */
const isActive = (r) => {
  return r.path === proxy.$route.path
}
/**
 * 当前选中的tag样式
 */
const activeStyle = (tag) => {
  if (!isActive(tag)) return {};
  return {
    "background-color": theme.value,
    "border-color": theme.value
  };
}
/**
 * 当前的tag是否固定在上面
 */
const isAffix = (tag) => {
  return tag.meta && tag.meta.affix
}


/**
 * 是否是首页tag 
 */
const isFirstView = () => {
  try {
    return selectedTag.value.fullPath === visitedViews.value[1].fullPath || selectedTag.value.fullPath === '/index'
  } catch (err) {
    return false
  }
}
/**
 * 是否是最后一个tag 
 */
const isLastView = () => {
  try {
    return selectedTag.value.fullPath === visitedViews.value[visitedViews.value.length - 1].fullPath
  } catch (err) {
    return false
  }
}
/**
 * 获取需要固定的tag
 */
const filterAffixTags = (rs, basePath = '') => {
  let tags = []
  rs.forEach(r => {
    if (r.meta && r.meta.affix) {
      const p = r.path.length > 0 && r.path[0] === '/' ? r.path : '/' + r.path;
      const tagPath = getNormalPath(basePath + '/' + p)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: r.name,
        meta: { ...r.meta }
      })
    }
    if (r.children) {
      const tempTags = filterAffixTags(r.children, r.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
/**
 * 初始化tags
 */
const initTags = () => {
  const res = filterAffixTags(routes.value);
  affixTags.value = res;
  for (const tag of res) {
    // Must have tag name
    if (tag.name) {
      store.dispatch('tagsView/addVisitedView', tag)
    }
  }
}
/**
 * 添加一个tag
 */
const addTags = () => {
  const { name } = proxy.$route;
  if (name) {
    store.dispatch('tagsView/addView', proxy.$route)
  }
  return false
}
/**
 * 移动到当前选中的tag
 */
const moveToCurrentTag = () => {
  nextTick(() => {
    for (const r of visitedViews.value) {
      if (r.path === proxy.$route.path) {
        scrollPaneRef.value.moveToTarget(r);
        // when query is different then update
        if (r.fullPath !== proxy.$route.fullPath) {
          store.dispatch('tagsView/updateVisitedView', proxy.$route.path)
        }
      }
    }
  })
}
/**
 * 刷新当前页面
 */
const refreshSelectedTag = (view) => {
  store.dispatch('tagsView/delCachedView', view).then(() => {
    const { fullPath } = view
    nextTick(() => {
      router.replace({
        path: '/redirect' + fullPath
      })
    })
  })
}
/**
 * 关闭当前选中的tag
 */
const closeSelectedTag = (view) => {
  lockFlag.value = true;
  store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
    if (isActive(view)) {
      setTimeout(() => {
        lockFlag.value = false;
      }, 0)
      toLastView(visitedViews, view)
    }
  })
}
/**
 * 关闭右边的tags
 */
const closeRightTags = () => {
  store.dispatch('tagsView/delRightTags', selectedTag.value).then(visitedViews => {
    if (!visitedViews.find(i => i.fullPath === proxy.$route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}

/**
 * 关闭左侧的tags
 */
const closeLeftTags = () => {
  store.dispatch('tagsView/delLeftTags', selectedTag.value).then(visitedViews => {
    if (!visitedViews.find(i => i.fullPath === proxy.$route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}
/**
 * 关闭其他的tags
 */
const closeOthersTags = () => {
  router.push(selectedTag.value).catch(() => { });
  store.dispatch('tagsView/delOthersViews', selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}
/**
 * 关闭所有的tags
 */
const closeAllTags = (view) => {
  lockFlag.value = true;
  store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
    if (affixTags.value.some(tag => tag.path === proxy.$route.path)) {
      return
    }
    setTimeout(() => {
      lockFlag.value = false;
    }, 0)
    toLastView(visitedViews, view)
  })
}
/**
 * 跳转到最后一个tag
 */
const toLastView = (visitedViews, view) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}
/**
 * 鼠标右键打开菜单
 */
const openMenu = (tag, e) => {
  const menuMinWidth = 105
  const offsetLeft = proxy.$el.getBoundingClientRect().left // container margin left
  const offsetWidth = proxy.$el.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  const l = e.clientX - offsetLeft + 15 // 15: margin right

  if (l > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = l
  }

  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}
/**
 * 关闭菜单
 */
const closeMenu = () => {
  visible.value = false
}
/**
 * 鼠标滚动
 */
const handleScroll = () => {
  closeMenu()
}
/**
 * 挂载页面初始化tags
 */
// onMounted(() => {
//   initTags()
//   addTags()
// })
/**
 * 第一次加载，页面初始化挂载
 */
const firstLoad = ref(true);

/**
 * 路由发生变化，需要修改当前选中tag 
 */

watchEffect(() => {
  if (proxy.$route && !lockFlag.value) {
    if (firstLoad.value) {
      //  挂载页面初始化tags
      initTags()
      addTags()
      firstLoad.value = false;
    }
    addTags();
    moveToCurrentTag();
  }
})

/**
 * 打开的右侧菜单注册事件，关闭取消事件
 */
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})


</script>
   
<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
      <template slot="default">
        <router-link
          v-for="tag in visitedViews"
          :key="tag.path"
          :data-path="tag.path"
          :class="isActive(tag) ? 'active' : ''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          class="tags-view-item"
          :style="activeStyle(tag)"
          @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
          @contextmenu.prevent.native="openMenu(tag, $event)"
        >
          {{ tag.title }}
          <span
            v-if="!isAffix(tag)"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </router-link>
      </template>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">
        <i class="el-icon-refresh-right"></i> 刷新页面
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <i class="el-icon-close"></i> 关闭当前
      </li>
      <li @click="closeOthersTags">
        <i class="el-icon-circle-close"></i> 关闭其他
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <i class="el-icon-back"></i> 关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <i class="el-icon-right"></i> 关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <i class="el-icon-circle-close"></i> 全部关闭
      </li>
    </ul>
  </div>
</template>

<style lang='scss' scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>