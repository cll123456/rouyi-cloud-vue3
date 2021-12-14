<script setup>
import { Message } from 'element-ui'
import { ref, computed, nextTick,getCurrentInstance  } from '@vue/composition-api';
import SvgIcon from './../SvgIcon';
/**
 * 当前路由实例
 */
import router from '@/router';

/**
 * store
 */
import store from '@/store'
/**
 * 获取当前实例
 */
const {proxy} = getCurrentInstance();
/**
 * 当前的大小
 */
const size = computed(() => store.getters.size);


/**
 * size options
 */
const sizeOptions = ref([
  { label: 'Large', value: 'large' },
  { label: 'Medium', value: 'medium' },
  { label: 'Small', value: 'small' },
  { label: 'Mini', value: 'mini' }
])

/**
 * 刷新页面
 */
const refreshView = async () => {
  // In order to make the cached page re-rendered
  store.dispatch('tagsView/delAllCachedViews', proxy.$route)

  const { fullPath } = proxy.$route

  nextTick(() => {
    router.replace({
      //  这个需要设置redirecct的原因
      path: '/redirect' + fullPath
      // path: fullPath
    })
  })
}
/**
 * 处理当前元素的大小
 */
const handleSetSize = (size) => {
  proxy.$ELEMENT.size = size;
  store.dispatch('app/setSize', size)
  refreshView()
  Message({
    message: 'Switch Size Success',
    type: 'success'
  })
};

</script>
<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <div class="size-icon--style">
        <svg-icon class-name="size-icon" icon-class="size" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item of sizeOptions"
            :key="item.value"
            :disabled="size === item.value"
            :command="item.value"
          >
            {{
              item.label
            }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang='scss' scoped>
.size-icon--style {
  font-size: 18px;
  line-height: 50px;
  padding-right: 7px;
}
</style>