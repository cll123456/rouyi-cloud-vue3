<script setup>
import { ref, computed } from '@vue/composition-api'

const props = defineProps({
  /**
   * 总页码数量
   */
  total: {
    required: true,
    type: Number
  },
  /**
   * 当前页面
   */
  page: {
    type: Number,
    default: 1
  },
  /**
   * 默认每页多少条
   */
  limit: {
    type: Number,
    default: 10
  },
  /**
   * 下拉选择每页多少条
   */
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50, 100, 200]
    }
  },
  /**
   *  移动端页码按钮的数量端默认值5
   */
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  },
  /**
   * 页码布局
   */
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  /**
   * 是否需要背景
   */
  background: {
    type: Boolean,
    default: true
  },
  /**
   * 自动滚动
   */
  autoScroll: {
    type: Boolean,
    default: true
  },
  /**
   * 是否隐藏
   */
  hidden: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits();
/**
 * 当前第几页
 */
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})
/**
 *  当前页面x显示条数
 */
const pageSize = computed({
  get: () => props.limit,
  set: (val) => {
    emit('update:limit', val)
  }
})

/**
 * 每页条数切换
 */
const handleSizeChange = (val) => {
  pageSize.value = val;
  emit('pagination')
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
/**
 * 页码切换
 */
const handleCurrentChange = (val) => {
  currentPage.value = val;
  emit('pagination')
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}

</script>
<template>
  <div :class="{ 'hidden': props.hidden }" class="pagination-container">
    <el-pagination
      :background="props.background"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :layout="props.layout"
      :page-sizes="props.pageSizes"
      :pager-count="pagerCount"
      :total="props.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang='scss' scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  width: 100%;
}
.pagination-container.hidden {
  display: none;
}
</style>