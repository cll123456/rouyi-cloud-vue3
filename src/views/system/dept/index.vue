<script setup>
import { ref, nextTick } from 'vue';
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDict } from '../../../hooks/dict';
import { handleTree, parseTime } from '../../../utils/ruoyi';
import DictTag from './../../../components/DictTag/index.vue';
import TreeSelect from './../../../components/TreeSelect/index.vue'
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from '../../../api/system/dept';
import { Sort, Search, Refresh, Plus, Delete, Edit } from '@element-plus/icons-vue';

// 遮罩层
const loading = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 表格树数据
const deptList = ref([]);
// 部门树选项
const deptOptions = ref([]);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
// 是否展开，默认全部展开
const isExpandAll = ref(true);
// 重新渲染表格状态
const refreshTable = ref(true);
// 是否展开
const expand = ref(false);
// 查询参数
const queryParams = ref({
   deptName: undefined,
   status: undefined
});
// 表单参数
const form = ref({
   deptId: undefined,
   parentId: undefined,
   deptName: undefined,
   orderNum: undefined,
   leader: undefined,
   phone: undefined,
   email: undefined,
   status: "0"
});
// 表单校验
const rules = ref({
   parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
   deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
   orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
   email: [{
      type: "email",
      message: "'请输入正确的邮箱地址",
      trigger: ["blur", "change"]
   }
   ],
   phone: [{
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
   }]
})
/***form ref */
const formRef = ref(null);
/**queryForm ref */
const queryFormRef = ref(null);
/** 查询部门列表 */
const getList = () => {
   loading.value = true;
   listDept(queryParams.value).then(response => {
      deptList.value = handleTree(response.data, "deptId");
      loading.value = false;
   });
}
// 取消按钮
const cancel = () => {
   open.value = false;
   reset();
}
// 表单重置
const reset = () => {
   form.value = {
      deptId: undefined,
      parentId: undefined,
      deptName: undefined,
      orderNum: undefined,
      leader: undefined,
      phone: undefined,
      email: undefined,
      status: "0"
   };
   if (formRef.value) {
      formRef.value.resetFields();
   }
}
/** 搜索按钮操作 */
const handleQuery = () => {
   getList();
}
/** 重置按钮操作 */
const resetQuery = () => {
   queryFormRef.value.resetFields();
   handleQuery();
}
/** 新增按钮操作 */
const handleAdd = async (row) => {
   reset();
   await listDept().then(response => {
      deptOptions.value = handleTree(response.data, "deptId");
   });
   if (row != undefined) {
      form.value.parentId = row.deptId;
   }
   open.value = true;
   title.value = "添加部门";

}
/** 展开/折叠操作 */
const toggleExpandAll = () => {
   refreshTable.value = false;
   isExpandAll.value = !isExpandAll.value;
   nextTick(() => {
      refreshTable.value = true;
   });
}
/** 修改按钮操作 */
const handleUpdate = async (row) => {
   reset();
   await listDeptExcludeChild(row.deptId).then(response => {
      deptOptions.value = handleTree(response.data, "deptId");
   });
   getDept(row.deptId).then(response => {
      form.value = response.data;
      form.value.orderNum = Number(form.value.orderNum);
      open.value = true;
      title.value = "修改部门";
   });

}
/** 提交按钮 */
const submitForm = () => {
   formRef.value.validate(valid => {
      if (valid) {
         if (form.value.deptId != undefined) {
            updateDept(form.value).then(response => {
               ElMessage.success("修改成功");
               open.value = false;
               getList();
            });
         } else {
            addDept(form.value).then(response => {
               ElMessage.success("新增成功");
               open.value = false;
               getList();
            });
         }
      }
   });
}
/** 删除按钮操作 */
const handleDelete = (row) => {
   ElMessageBox.confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delDept(row.deptId);
   }).then(() => {
      getList();
      ElMessage.success("删除成功");
   }).catch(() => { });
}

const { sys_normal_disable } = useDict('sys_normal_disable');
getList();
</script>
<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
         <el-form-item label="部门名称" prop="deptName">
            <el-input
               v-model="queryParams.deptName"
               placeholder="请输入部门名称"
               clearable
             
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
               <el-option
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" :icon="Search"  @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh"  @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="primary"
               plain
               :icon="Plus"
               @click="handleAdd"
               v-hasPermi="['system:dept:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="info"
               plain
               :icon="Sort"
               @click="toggleExpandAll"
            >展开/折叠</el-button>
         </el-col>
         <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table
         v-if="refreshTable"
         v-loading="loading"
         :data="deptList"
         row-key="deptId"
         :default-expand-all="isExpandAll"
         :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
         <el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
         <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
         <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
               <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button
                  type="text"
                  :icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:dept:edit']"
               >修改</el-button>
               <el-button
                  type="text"
                  :icon="Plus"
                  @click="handleAdd(scope.row)"
                  v-hasPermi="['system:dept:add']"
               >新增</el-button>
               <el-button
                  v-if="scope.row.parentId != 0"
                  type="text"
                  :icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:dept:remove']"
               >删除</el-button>
            </template>
         </el-table-column>
      </el-table>

      <!-- 添加或修改部门对话框 -->
      <el-dialog :title="title" v-model="open" width="600px" append-to-body>
         <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-row>
               <el-col :span="24" v-if="form.parentId !== 0">
                  <el-form-item label="上级部门" prop="parentId">
                     <tree-select
                        v-model:value="form.parentId"
                        :options="deptOptions"
                        :objMap="{
                           value: 'deptId',
                           label: 'deptName',
                           children: 'children'
                        }"
                        placeholder="选择上级部门"
                     />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="部门名称" prop="deptName">
                     <el-input v-model="form.deptName" placeholder="请输入部门名称" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="显示排序" prop="orderNum">
                     <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="负责人" prop="leader">
                     <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="联系电话" prop="phone">
                     <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="邮箱" prop="email">
                     <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="部门状态">
                     <el-radio-group v-model="form.status">
                        <el-radio
                           v-for="dict in sys_normal_disable"
                           :key="dict.value"
                           :label="dict.value"
                        >{{ dict.label }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button> 
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<style lang='scss' scoped>
</style>