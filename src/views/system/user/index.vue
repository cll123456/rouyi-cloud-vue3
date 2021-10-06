<script setup>
import { ref, watch } from 'vue';
import { useDict } from '../../../hooks/dict';
import { treeselect } from '../../../api/system/dept';
import RightToolbar from './../../../components/RightToolbar/index.vue'
import { listUser } from '../../../api/system/user';
import { addDateRange, parseTime } from '../../../utils/ruoyi';
import pagination from './../../../components/Pagination/index.vue'

/**
 * 部门名称
 */
const deptName = ref('');

/**
 * 部门选项树
 */
const deptOptions = ref(undefined);
/**
 * 默认树的选项
 */
const defaultProps = ref({
   children: "children",
   label: "label"
})
/**
 * 部门树的ref
 */
const deptTreeRef = ref(null);

/**
 * 通过条件过滤节点
 */
const filterNode = (value, data) => {
   if (!value) return true
   return data.label.indexOf(value) !== -1
}
/**
 * 监听输入框的变化，查找内容
 */
watch(deptName, (val) => {
   deptTreeRef.value.filter(val);
})

/** 查询部门下拉树结构 */
const getTreeselect = () => {
   treeselect().then(response => {
      deptOptions.value = response.data;
   });
}

/**
 * 查询条件
 */
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   userName: undefined,
   phonenumber: undefined,
   status: undefined,
   deptId: undefined
})
/**
 * 日期
 */
const dateRange = ref([])
/**
 * 条件查询ref
 */
const queryFormRef = ref(null);
/**
 * 默认显示条件
 */
const showSearch = ref(true);

/**
 * 表格loading
 */
const loading = ref(true);
/**
 * 表单数据
 */
const list = ref([]);

/**
 * 总条数
 */
const total = ref(0);

/**
 * 初始化数据
 */
const getList = () => {
   loading.value = true;
   listUser(addDateRange(queryParams.value, dateRange.value)).then(res => {
      loading.value = false;
      list.value = res.rows;
      total.value = res.total;
   })
}

/**
 * 点击树的节点，每个部门里面的用户
 */
const handleNodeClick = (data) => {
   queryParams.value.deptId = data.id;
   getList();
}
/**
 * 条件查询
 */
const handleQuery = () => {
   queryParams.value.pageNum = 1;
   getList();
}

/**
 * 重置查询
 */
const resetQuery = () => {
   dateRange.value = [];
   queryFormRef.value.resetFields();
   handleQuery();
}
/**
 * 非单个禁用
 */
const single = ref(true)
/**
 * 选中多个进行删除
 */
const multiple = ref(true)

// 列信息
const columns = ref([
   { key: 0, label: `用户编号`, visible: true },
   { key: 1, label: `用户名称`, visible: true },
   { key: 2, label: `用户昵称`, visible: true },
   { key: 3, label: `部门`, visible: true },
   { key: 4, label: `手机号码`, visible: true },
   { key: 5, label: `状态`, visible: true },
   { key: 6, label: `创建时间`, visible: true }
])

/**
 * 新增
 */
const handleAdd = () => { }
/**
 * 修改
 */
const handleUpdate = () => { }
/**
 * 删除
 */
const handleDelete = () => { }
/**
 * 导入
 */
const handleImport = () => { }
/**
 * 导出
 */
const handleExport = () => { }

/**
 * 选择条数
 */
const handleSelectionChange = (selection) => { }

// 初始化部门数据
getTreeselect();

// 下拉框数据
const { sys_normal_disable } = useDict('sys_normal_disable');

// 初始化列表数据
getList();

</script>
<template>
   <div class="app-container">
      <el-row :gutter="20">
         <!--部门数据-->
         <el-col :span="4" :xs="24">
            <div class="head-container">
               <el-input
                  v-model="deptName"
                  placeholder="请输入部门名称"
                  clearable
                  prefix-icon="el-icon-search"
                  style="margin-bottom: 20px"
               />
            </div>
            <div class="head-container">
               <el-tree
                  :data="deptOptions"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  ref="deptTreeRef"
                  default-expand-all
                  @node-click="handleNodeClick"
               />
            </div>
         </el-col>
         <!--用户数据-->
         <el-col :span="20" :xs="24">
            <!-- 条件查询 -->
            <el-form
               :model="queryParams"
               ref="queryFormRef"
               :inline="true"
               v-show="showSearch"
               label-width="68px"
            >
               <el-form-item label="用户名称" prop="userName">
                  <el-input
                     v-model="queryParams.userName"
                     placeholder="请输入用户名称"
                     clearable
                     style="width: 240px"
                     @keyup.enter.native="handleQuery"
                  />
               </el-form-item>
               <el-form-item label="手机号码" prop="phonenumber">
                  <el-input
                     v-model="queryParams.phonenumber"
                     placeholder="请输入手机号码"
                     clearable
                     style="width: 240px"
                     @keyup.enter.native="handleQuery"
                  />
               </el-form-item>
               <el-form-item label="状态" prop="status">
                  <el-select
                     v-model="queryParams.status"
                     placeholder="用户状态"
                     clearable
                     style="width: 240px"
                  >
                     <el-option
                        v-for="dict in sys_normal_disable"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                     />
                  </el-select>
               </el-form-item>
               <el-form-item label="创建时间">
                  <el-date-picker
                     v-model="dateRange"
                     style="width: 240px"
                     value-format="yyyy-MM-dd"
                     type="daterange"
                     range-separator="-"
                     start-placeholder="开始日期"
                     end-placeholder="结束日期"
                  ></el-date-picker>
               </el-form-item>
               <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                  <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
               </el-form-item>
            </el-form>

            <!-- 按钮组 -->
            <el-row :gutter="10" class="mb8">
               <el-col :span="1.5">
                  <el-button
                     type="primary"
                     plain
                     icon="el-icon-plus"
                     @click="handleAdd"
                     hasPermi="['system:user:add']"
                  >新增</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="success"
                     plain
                     icon="el-icon-edit"
                     :disabled="single"
                     @click="handleUpdate"
                     hasPermi="['system:user:edit']"
                  >修改</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="danger"
                     plain
                     icon="el-icon-delete"
                     :disabled="multiple"
                     @click="handleDelete"
                     hasPermi="['system:user:remove']"
                  >删除</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="info"
                     plain
                     icon="el-icon-upload2"
                     @click="handleImport"
                     hasPermi="['system:user:import']"
                  >导入</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="warning"
                     plain
                     icon="el-icon-download"
                     @click="handleExport"
                     hasPermi="['system:user:export']"
                  >导出</el-button>
               </el-col>
               <right-toolbar
                  v-model:showSearch="showSearch"
                  @queryTable="getList"
                  :columns="columns"
               ></right-toolbar>
            </el-row>
            <!-- 表格 -->
            <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
               <el-table-column type="selection" width="50" align="center" />
               <el-table-column
                  label="用户编号"
                  align="center"
                  key="userId"
                  prop="userId"
                  v-if="columns[0].visible"
               />
               <el-table-column
                  label="用户名称"
                  align="center"
                  key="userName"
                  prop="userName"
                  v-if="columns[1].visible"
                  :show-overflow-tooltip="true"
               />
               <el-table-column
                  label="用户昵称"
                  align="center"
                  key="nickName"
                  prop="nickName"
                  v-if="columns[2].visible"
                  :show-overflow-tooltip="true"
               />
               <el-table-column
                  label="部门"
                  align="center"
                  key="deptName"
                  prop="dept.deptName"
                  v-if="columns[3].visible"
                  :show-overflow-tooltip="true"
               />
               <el-table-column
                  label="手机号码"
                  align="center"
                  key="phonenumber"
                  prop="phonenumber"
                  v-if="columns[4].visible"
                  width="120"
               />
               <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
                  <template #default="scope">
                     <el-switch
                        v-model="scope.row.status"
                        active-value="0"
                        inactive-value="1"
                        @change="handleStatusChange(scope.row)"
                     ></el-switch>
                  </template>
               </el-table-column>
               <el-table-column
                  label="创建时间"
                  align="center"
                  prop="createTime"
                  v-if="columns[6].visible"
                  width="160"
               >
                  <template #default="scope">
                     <span>{{ parseTime(scope.row.createTime) }}</span>
                  </template>
               </el-table-column>
               <el-table-column
                  label="操作"
                  align="center"
                  width="160"
                  class-name="small-padding fixed-width"
               >
                  <template #default="scope">
                     <el-button
                        v-if="scope.row.userId !== 1"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        hasPermi="['system:user:edit']"
                     >修改</el-button>
                     <el-button
                        v-if="scope.row.userId !== 1"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        hasPermi="['system:user:remove']"
                     >删除</el-button>
                     <el-dropdown
                        v-if="scope.row.userId !== 1"
                        @command="(command) => handleCommand(command, scope.row)"
                        hasPermi="['system:user:resetPwd', 'system:user:edit']"
                     >
                        <span class="el-dropdown-link">
                           <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                        </span>
                        <template #dropdown>
                           <el-dropdown-menu>
                              <el-dropdown-item
                                 command="handleResetPwd"
                                 icon="el-icon-key"
                                 hasPermi="['system:user:resetPwd']"
                              >重置密码</el-dropdown-item>
                              <el-dropdown-item
                                 command="handleAuthRole"
                                 icon="el-icon-circle-check"
                                 hasPermi="['system:user:edit']"
                              >分配角色</el-dropdown-item>
                           </el-dropdown-menu>
                        </template>
                     </el-dropdown>
                  </template>
               </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <pagination
               v-show="total > 0"
               :total="total"
               v-model:page="queryParams.pageNum"
               v-model:limit="queryParams.pageSize"
               @pagination="getList"
            />
         </el-col>
      </el-row>
   </div>
</template>

<style lang='scss' scoped>
</style>