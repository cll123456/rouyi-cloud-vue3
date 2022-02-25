<script setup>
import { computed, ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex';
import tagsView from '../../../store/modules/tagsView';
/**
 *  每一个tag的间隔
 */
const tagAndTagSpacing = ref(4);
/**
 * 仓库
 */
const store = useStore();

/**
 * 获取当前的实例
 */
const { proxy } = getCurrentInstance();
/**
 * 向上分发方法
 */
const emits = defineEmits()



const scrollContainer = ref(null);
/**
 * 获取滚动内部的实例
 */
const scrollWrapper = computed(() => scrollContainer.value.$refs.wrap$);

/**
 * 每一次滚动的距离
 */
const handleScroll = (e) => {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  const $scrollWrapper = scrollWrapper.value;
  $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
}
/**
 * 向上分发滚动方法
 */
const emitScroll = () => {
  emits('scroll')
}

/**
 * 当前需要展示的tags
 */
const visitedViews = computed(() => store.state.tagsView.visitedViews);

/**
 * 滚动目标
 */
const moveToTarget = (currentTag) => {
  const $container = proxy.$refs.scrollContainer.$el
  const $containerWidth = $container.offsetWidth
  const $scrollWrapper = scrollWrapper.value;

  let firstTag = null
  let lastTag = null

  // find first tag and last tag
  if (visitedViews.value.length > 0) {
    firstTag = visitedViews.value[0]
    lastTag = visitedViews.value[visitedViews.value.length - 1]
  }

  // 如果是移动到第一个，直接scrollleft  为 o
  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0
  } else if (lastTag === currentTag) {
    // 移动到最后一个，直接用el-scroll的scrollwidth 减去容器长度
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
  } else {
    // 这里是移动中间部位
    const tagListDom = document.getElementsByClassName('tags-view-item');
    // find preTag and nextTag
    const currentIndex = visitedViews.value.findIndex(item => item === currentTag)
    let prevTag = null
    let nextTag = null
    // 获取上一个和下一个的tag的dom
    for (const k in tagListDom) {
      // 除去length属性
      if (k !== 'length' && Object.hasOwnProperty.call(tagListDom, k)) {
        if (tagListDom[k].dataset.path === visitedViews.value[currentIndex - 1].path) {
          prevTag = tagListDom[k];
        }
        if (tagListDom[k].dataset.path === visitedViews.value[currentIndex + 1].path) {
          nextTag = tagListDom[k];
        }
      }
    }

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing.value

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagAndTagSpacing.value
    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}
/**
 * 组件挂载需要添加滚动方法
 */
onMounted(() => {
  scrollWrapper.value.addEventListener('scroll', emitScroll, true)
})
/**
 * 组件卸载移除方法
 */
onBeforeUnmount(() => {
  scrollWrapper.value.removeEventListener('scroll', emitScroll)
})

defineExpose({
  moveToTarget,
})
</script>
<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.native.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<style lang='scss' scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }
  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>