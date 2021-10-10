<script setup>
import { computed } from 'vue'
const props = defineProps({
  // 数据
  options: {
    type: Array,
    default: null,
  },
  // 当前的值
  value: [Number, String, Array],
})

/**获取当前的values值 */
const values = computed(() => {
  if (props.value !== null && typeof props.value !== 'undefined') {
    return Array.isArray(props.value) ? props.value : [String(props.value)];
  } else {
    return [];
  }
})

</script>
<template>
  <div>
    <template v-for="(item, index) in props.options">
      <template v-if="values.includes(item.value)">
        <span
          v-if="item.elTagType == 'default' || item.elTagType == ''"
          :key="item.value"
          :index="index"
          :class="item.elTagType"
        >{{ item.label }}</span>
        <el-tag
          v-else
          :disable-transitions="true"
          :key="item.value + ''"
          :index="index"
          :type="item.elTagType === 'primary' ? '' : item.elTagType"
          :class="item.elTagType"
        >{{ item.label }}</el-tag>
      </template>
    </template>
  </div>
</template>

<style lang='scss' >
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>