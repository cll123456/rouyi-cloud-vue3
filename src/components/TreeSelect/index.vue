<script setup>
import { ref, nextTick, onMounted } from 'vue';

const props = defineProps({
  /* 配置项 */
  objMap: {
    type: Object,
    default: () => {
      return {
        value: 'id', // ID字段名
        label: 'label', // 显示名称
        children: 'children' // 子级字段名
      }
    }
  },
  /* 自动收起 */
  accordion: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  /**当前双向数据绑定的值 */
  value: {
    type: String,
    default: ''
  },
  /**当前的数据 */
  options: {
    type: Array,
    default: () => []
  },
  /**输入框内部的文字 */
  placeholder: {
    type: String,
    default: ''
  }

})
/** select ref */
const selectRef = ref(null);


/**tree ref */
const treeRef = ref(null);
/**options data */
const data = ref([{
  id: 1,
  label: 'Level one 1',
  children: [
    {
      id: 4,
      label: 'Level two 1-1',
      children: [
        {
          id: 9,
          label: 'Level three 1-1-1',
        },
        {
          id: 10,
          label: 'Level three 1-1-2',
        },
      ],
    },
  ],
},
{
  id: 2,
  label: 'Level one 2',
  children: [
    {
      id: 5,
      label: 'Level two 2-1',
    },
    {
      id: 6,
      label: 'Level two 2-2',
    },
  ],
},
{
  id: 3,
  label: 'Level one 3',
  children: [
    {
      id: 7,
      label: 'Level two 3-1',
    },
    {
      id: 8,
      label: 'Level two 3-2',
    },
  ],
}]);

/**向上分发 */
const emit = defineEmits();

// 初始值
const valueId = ref(props.value + '');
const valueTitle = ref('');
const defaultExpandedKey = ref([]);

const initHandle = () => {
  if (valueId.value) {
    valueTitle.value = treeRef.value.getNode(valueId.value).data[props.objMap.label] // 初始化显示
    treeRef.value.setCurrentKey(valueId.value) // 设置默认选中
    defaultExpandedKey.value = [valueId.value] // 设置默认展开
  }
  nextTick(() => {
    const scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
    const scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
    scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
    scrollBar.forEach(ele => {
      ele.style.width = 0;
    })
  })
}
// 切换选项
const handleNodeClick = (node) => {
  valueTitle.value = node[props.objMap.label]
  valueId.value = node[props.objMap.value] + '';
  defaultExpandedKey.value = [];
  // 赋值选中的值
  emit('update:value', valueId.value)
  // 选中后失去焦点，隐藏下拉框
  selectRef.value.blur()
  // 把数据还原
  selectFilterData('')
}
/**
 * 下拉框搜索
 */
const selectFilterData = (val) => {
  treeRef.value.filter(val)
}
/**
 * 过滤节点
 */
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}
// 清除选中
const clearHandle = () => {
  valueTitle.value = ''
  valueId.value = ''
  defaultExpandedKey.value = [];
  // 赋值选中的值
  emit('update:value', valueId.value)
  clearSelected()
}
/* 清空选中样式 */
const clearSelected = () => {
  const allNode = document.querySelectorAll('#tree-option .el-tree-node')
  allNode.forEach((element) => element.classList.remove('is-current'))
}

/**
 * 初始化
 */
onMounted(() => {
  nextTick(function () {
    initHandle()
  })
})

</script>
<template>
  <div class="el-tree-select">
    <el-select
      v-model="valueId"
      ref="selectRef"
      :filterable="true"
      :clearable="true"
      @clear="clearHandle"
      :filter-method="selectFilterData"
      :placeholder="props.placeholder"
    >
      <el-option :value="valueId" :label="valueTitle">
        <el-tree
          id="tree-option"
          ref="treeRef"
          :accordion="props.accordion"
          :data="props.options"
          :props="props.objMap"
          :node-key="props.objMap.value"
          :expand-on-click-node="false"
          :default-expanded-keys="defaultExpandedKey"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-option>
    </el-select>
  </div>
</template>

<style lang='scss' scoped>
@import "./../../assets/styles/element-variables.scss";
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
}

.el-select-dropdown__item.selected {
  font-weight: normal;
}

ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}

:deep(.el-tree-node__content:hover),
:deep(.el-tree-node__content:active),
:deep(.is-current > div:first-child),
:deep(.el-tree-node__content:focus) {
  background-color: mix(#fff, $--color-primary, 90%);
  color: $--color-primary;
}
</style>