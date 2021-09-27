<script setup>
import { ElMessage } from 'element-plus';
import { ref, computed, getCurrentInstance, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

/**
 * store
 */
const store = useStore();
/**
 * 当前的大小
 */
const size = computed(() => store.getters.size);
/***
 * 当前路由对象
 */
const route = useRoute();
/**
 * 当前路由实例
 */
const router = useRouter();
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
 * 当前上下文
 */
const instance = getCurrentInstance();
/**
 * 刷新页面
 */
const refreshView = async () => {
  // In order to make the cached page re-rendered
  store.dispatch('tagsView/delAllCachedViews', route)

  const { fullPath } = route

   instance.ctx.$nextTick(() => {
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
  instance.appContext.config.globalProperties.$ELEMENT.size = size;
  store.dispatch('app/setSize', size)
  refreshView()
  ElMessage({
    message: 'Switch Size Success',
    type: 'success'
  })
};

</script>
<template>
  <div>
    <el-dropdown trigger="click" @command="handleSetSize">
      <div>
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
</style>