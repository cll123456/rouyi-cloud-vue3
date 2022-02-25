<script setup>
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { ref } from 'vue';
import Pagination from './../../../components/Pagination/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDict } from '../../../hooks/dict';
import DictTag from './../../../components/DictTag/index.vue';
import { download, parseTime, addDateRange } from '../../../utils/ruoyi';
import { listType, getType, delType, addType, updateType, refreshCache, exportType } from '../../../api/system/dict/type';
import { Download, Search, Refresh, Plus, Delete, Edit } from '@element-plus/icons-vue';
/**queryForm ref */
const queryFormRef = ref(null);
// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 非单个禁用
const single = ref(true);
// 非多个禁用
const multiple = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 总条数
const total = ref(0);
// 字典表格数据
const typeList = ref([]);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
// 日期范围
const dateRange = ref([]);
// 查询参数
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   dictName: undefined,
   dictType: undefined,
   status: undefined
});
// 表单参数
const form = ref({
   dictId: undefined,
   dictName: undefined,
   dictType: undefined,
   status: "0",
   remark: undefined
});
// 表单校验
const rules = ref({
   dictName: [
      { required: true, message: "字典名称不能为空", trigger: "blur" }
   ],
   dictType: [
      { required: true, message: "字典类型不能为空", trigger: "blur" }
   ]
})
/**form ref */
const formRef = ref(null);

/** 查询字典类型列表 */
const getList = () => {
   loading.value = true;
   listType(addDateRange(queryParams.value, dateRange.value)).then(response => {
      typeList.value = response.rows;
      total.value = response.total;
      loading.value = false;
   }
   );
}
// 取消按钮
const cancel = () => {
   open.value = false;
   reset();
}
// 表单重置
const reset = () => {
   form.value = {
      dictId: undefined,
      dictName: undefined,
      dictType: undefined,
      status: "0",
      remark: undefined
   };
   if (formRef.value) {
      formRef.value.resetFields();
   }
}
/** 搜索按钮操作 */
const handleQuery = () => {
   queryParams.value.pageNum = 1;
   getList();
}
/** 重置按钮操作 */
const resetQuery = () => {
   dateRange.value = [];
   queryFormRef.value.resetFields();
   handleQuery();
}
/** 新增按钮操作 */
const handleAdd = () => {
   reset();
   open.value = true;
   title.value = "添加字典类型";
}
// 多选框选中数据
const handleSelectionChange = (selection) => {
   ids.value = selection.map(item => item.dictId)
   single.value = selection.length != 1
   multiple.value = !selection.length
}
/** 修改按钮操作 */
const handleUpdate = (row) => {
   reset();
   const dictId = row.dictId || ids.value
   getType(dictId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改字典类型";
   });
}
/** 提交按钮 */
const submitForm = () => {
   formRef.value.validate(valid => {
      if (valid) {
         if (form.value.dictId != undefined) {
            updateType(form.value).then(response => {
               ElMessage.success("修改成功");
               open.value = false;
               getList();
            });
         } else {
            addType(form.value).then(response => {
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
   const dictIds = row.dictId || ids.value;
   ElMessageBox.confirm('是否确认删除字典编号为"' + dictIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delType(dictIds);
   }).then(() => {
      getList();
      ElMessage.success("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
const handleExport = () => {
   ElMessageBox.confirm('是否确认导出所有类型数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return exportType(queryParams.value);
   }).then(response => {
      download(response.msg);
   })
}
/** 刷新缓存按钮操作 */
const handleRefreshCache = () => {
   refreshCache().then(() => {
      ElMessage.success("刷新成功");
   });
}

const { sys_normal_disable } = useDict('sys_normal_disable');

getList();
</script>
<template>
   <div class="app-container">
      <el-form
         :model="queryParams"
         ref="queryFormRef"
         :inline="true"
         v-show="showSearch"
         label-width="68px"
      >
         <el-form-item label="字典名称" prop="dictName">
            <el-input
               v-model="queryParams.dictName"
               placeholder="请输入字典名称"
               clearable
               style="width: 240px"
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="字典类型" prop="dictType">
            <el-input
               v-model="queryParams.dictType"
               placeholder="请输入字典类型"
               clearable
               style="width: 240px"
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select
               v-model="queryParams.status"
               placeholder="字典状态"
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
               value-format="YYYY-MM-DD"
               type="daterange"
               range-separator="-"
               start-placeholder="开始日期"
               end-placeholder="结束日期"
            ></el-date-picker>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="primary"
               plain
               :icon="Plus"
               @click="handleAdd"
               v-hasPermi="['system:dict:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               :icon="Edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['system:dict:edit']"
            >修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               :icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:dict:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               :icon="Download"
               @click="handleExport"
               v-hasPermi="['system:dict:export']"
            >导出</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               :icon="Refresh"
               @click="handleRefreshCache"
               v-hasPermi="['system:dict:remove']"
            >刷新缓存</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="字典编号" align="center" prop="dictId" />
         <el-table-column
            label="字典名称"
            align="center"
            prop="dictName"
            :show-overflow-tooltip="true"
         />
         <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
            <template #default="scope">
               <router-link :to="'/system/dict-data/index/' + scope.row.dictId" class="link-type">
                  <span>{{ scope.row.dictType }}</span>
               </router-link>
            </template>
         </el-table-column>
         <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
               <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
         <el-table-column label="创建时间" align="center" prop="createTime" width="180">
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
                  v-hasPermi="['system:dict:edit']"
               >修改</el-button>
               <el-button
                  type="text"
                  :icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:dict:remove']"
               >删除</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" v-model="open" width="500px" append-to-body>
         <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="字典名称" prop="dictName">
               <el-input v-model="form.dictName" placeholder="请输入字典名称" />
            </el-form-item>
            <el-form-item label="字典类型" prop="dictType">
               <el-input v-model="form.dictType" placeholder="请输入字典类型" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
               <el-radio-group v-model="form.status">
                  <el-radio
                     v-for="dict in sys_normal_disable"
                     :key="dict.value"
                     :label="dict.value"
                  >{{ dict.label }}</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
               <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
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