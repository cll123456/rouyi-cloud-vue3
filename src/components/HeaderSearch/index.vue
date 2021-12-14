<script setup>
import Fuse from 'fuse.js'
import { computed, ref, nextTick, onMounted, watchEffect, watch, getCurrentInstance } from '@vue/composition-api'
import { getNormalPath } from '../../utils/ruoyi';
import router from '@/router';
import store from '@/store'
import SvgIcon from './../SvgIcon';


const { proxy } = getCurrentInstance();
/**
 * 当前搜索的内容
 */
const search = ref('');
/**
 * 数组
 */
const options = ref([]);
/**
 * 搜索池
 */
const searchPool = ref([]);
/**
 * 是否select
 */
const show = ref(false);
/**
 * fuse对象
 */
const fuse = ref(undefined);


/**
 * 获取当前的路由菜单
 */
const routes = computed(() => store.getters.permission_routes);
/**
 * headerSearch  Dom
 */
const headerSearchSelectRef = ref(null);


/**
 * 点击图片，打开输入框
 */
const click = () => {
  show.value = !show.value
  if (show.value) {
    headerSearchSelectRef.value && headerSearchSelectRef.value.focus()
  }
};
/**
 * 关闭图标
 */
const close = () => {
  if (headerSearchSelectRef.value) {
    headerSearchSelectRef.value.blur();
  }
  options.value = []
  show.value = false

}
/**
 * 判断path是否是一个链接
 */
const ishttp = (url) => {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}
/**
 * 点击结果，进入路由
 */
const change = (val) => {
  const path = val.path;
  if (ishttp(path)) {
    // http(s):// 路径新窗口打开
    const pindex = path.indexOf("http");
    window.open(path.substr(pindex, path.length), "_blank");
  } else {
    // 如果当前路径就是，不需要跳转
    if (proxy.$route.path === path) {
      // 打开path 后置空属性
      search.value = ''
      options.value = []
      nextTick(() => {
        show.value = false
      })
      return
    }
    router.push(path)
  }

  // 打开path 后置空属性
  search.value = ''
  options.value = []
  nextTick(() => {
    show.value = false
  })
}
/**
 * 初始化fuse实例
 */
const initFuse = (list) => {
  fuse.value = new Fuse(list, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [{
      name: 'title',
      weight: 0.7
    }, {
      name: 'path',
      weight: 0.3
    }]
  })
}
/**
 * 生成路由，绑定到下拉框
 */
const generateRoutes = (routes, basePath = '', prefixTitle = []) => {
  let res = []

  for (const r of routes) {
    // skip hidden router
    if (r.hidden) { continue }
    const p = r.path.length > 0 && r.path[0] === '/' ? r.path : '/' + r.path;
    const data = {
      path: !ishttp(r.path) ? getNormalPath(basePath + p) : r.path,
      title: [...prefixTitle]
    }

    if (r.meta && r.meta.title) {
      data.title = [...data.title, r.meta.title]

      if (r.redirect !== 'noRedirect') {
        // only push the routes with title
        // special case: need to exclude parent router without redirect
        res.push(data)
      }
    }

    // recursive child routes
    if (r.children) {
      const tempRoutes = generateRoutes(r.children, data.path, data.title)
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes]
      }
    }
  }
  return res
}

/**
 * 获取查找的结果
 */
const querySearch = (query) => {
  if (query !== '') {
    options.value = fuse.value.search(query)
  } else {
    options.value = []
  }
}

// 初始化搜索池
onMounted(() => {
  searchPool.value = generateRoutes(routes.value);
})

// routes发生改变需要更新搜索池
watchEffect(() => {
  searchPool.value = generateRoutes(routes.value)
})

/**
 * 监听show的变化，然后动态绑定事件
 */
watch(show, (value) => {
  if (value) {
    document.body.addEventListener('click', close)
  } else {
    document.body.removeEventListener('click', close)
  }
})

/**
 * 每一次数据源发生改变，需要重新搜索
 */
watch(searchPool, (list) => {
  console.log(list, '----=---list')
  initFuse(list)
})
</script>
<template>
  <div :class="{ 'show': show }" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelectRef"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="option in options"
        :key="option.item.path"
        :value="option.item"
        :label="option.item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<style lang='scss' scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9 !important;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}

:deep(.el-input) {
  border-radius: 0;
  border: 0;
  padding-left: 0;
  padding-right: 0;
  box-shadow: none !important;
  border-bottom: 1px solid #d9d9d9;
  vertical-align: middle;
}
</style>