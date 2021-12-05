<script setup>
import { computed } from "@vue/composition-api";
import { isExternal } from "../../../utils/validate";

const props = defineProps({
  /**
   * 跳转路由对象
   */
  to: {
    type: [String, Object],
    required: true
  }
})

/**
 * 判断是否为外链
 */
const isExternalPath = computed(() => {
  return isExternal(props.to)
})

/**
 * component渲染的组件类，外连接直接渲染a,否则是router-link
 */
const type = computed(() => {
  if (isExternalPath.value) {
    return 'a'
  }
  return 'router-link'
})



const linkProps = () => {
  if (isExternalPath.value) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    to: props.to
  }
}
</script>
<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>

<style lang='scss' scoped>
</style>