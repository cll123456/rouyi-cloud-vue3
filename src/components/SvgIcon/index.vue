<script setup>
import { computed } from "vue";
import { isExternal } from "../../utils/validate";



const props = defineProps({
  /**
   * icon图标名称
   */
  iconClass: {
    type: String,
    required: true
  },
  /**
   * icon中的类名
   */
  className: {
    type: String,
    default: ''
  }
})

/**
 * 判断是否为外链图标
 */

const isExternalIcon = computed(() => isExternal(props.iconClass))

/**
 * 外链图标的样式
 */
const styleExternalIcon = computed(() => ({
  mask: `url(${props.iconClass}) no-repeat 50% 50%`,
  '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
}));

/**
 * svg图标名称
 */
const iconName = computed(() => `#icon-${props.iconClass}`);

/**
 * svg类名
 */
const svgClass = computed(() => {
  if (props.className) {
    return 'svg-icon ' + props.className
  } else {
    return 'svg-icon'
  }
})

</script>
<template>
  <div
    v-if="isExternalIcon"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
  />
  <svg v-else :class="svgClass" aria-hidden="true">
    <use :href="iconName" />
  </svg>
</template>

<style lang='scss' scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>