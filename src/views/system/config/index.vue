<script>
export default{
   name: 'Config'
}
</script>
<script setup>
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { ref } from '@vue/composition-api';
import Pagination from './../../../components/Pagination/index.vue';
import { Message, MessageBox } from 'element-ui';
import { useDict } from '../../../hooks/dict';
import { download, parseTime, addDateRange } from '../../../utils/ruoyi';
import DictTag from './../../../components/DictTag/index.vue';
import { listConfig, getConfig, delConfig, addConfig, updateConfig, refreshCache, exportConfig } from '../../../api/system/config';

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
// 参数表格数据
const configList = ref([]);
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
   configName: undefined,
   configKey: undefined,
   configType: undefined
});
// 表单参数
const form = ref({
   configId: undefined,
   configName: undefined,
   configKey: undefined,
   configValue: undefined,
   configType: "Y",
   remark: undefined
});
// 表单校验
const rules = ref({
   configName: [
      { required: true, message: "参数名称不能为空", trigger: "blur" }
   ],
   configKey: [
      { required: true, message: "参数键名不能为空", trigger: "blur" }
   ],
   configValue: [
      { required: true, message: "参数键值不能为空", trigger: "blur" }
   ]
});

/***queryForm ref */
const queryFormRef = ref(null);
/**form ref */
const formRef = ref(null);

/** 查询参数列表 */
const getList = () => {
   loading.value = true;
   listConfig(addDateRange(queryParams.value, dateRange.value)).then(response => {
      configList.value = response.rows;
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
      configId: undefined,
      configName: undefined,
      configKey: undefined,
      configValue: undefined,
      configType: "Y",
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
   title.value = "添加参数";
}
// 多选框选中数据
const handleSelectionChange = (selection) => {
   ids.value = selection.map(item => item.configId)
   single.value = selection.length != 1
   multiple.value = !selection.length
}
/** 修改按钮操作 */
const handleUpdate = (row) => {
   reset();
   const configId = row.configId || ids.value
   getConfig(configId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改参数";
   });
}
/** 提交按钮 */
const submitForm = () => {
   formRef.value.validate(valid => {
      if (valid) {
         if (form.value.configId != undefined) {
            updateConfig(form.value).then(response => {
               Message.success("修改成功");
               open.value = false;
               getList();
            });
         } else {
            addConfig(form.value).then(response => {
               Message.success("新增成功");
               open.value = false;
               getList();
            });
         }
      }
   });
}
/** 删除按钮操作 */
const handleDelete = (row) => {
   const configIds = row.configId || ids.value;
   MessageBox.confirm('是否确认删除参数编号为"' + configIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delConfig(configIds);
   }).then(() => {
      getList();
      Message.success("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
const handleExport = () => {
   MessageBox.confirm('是否确认导出所有参数数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return exportConfig(queryParams.value);
   }).then(response => {
      download(response.msg);
   })
}
/** 刷新缓存按钮操作 */
const handleRefreshCache = () => {
   refreshCache().then(() => {
      Message.success("刷新成功");
   });
}

const { sys_yes_no } = useDict('sys_yes_no');
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
         <el-form-item label="参数名称" prop="configName">
            <el-input
               v-model="queryParams.configName"
               placeholder="请输入参数名称"
               clearable
             
               style="width: 240px"
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="参数键名" prop="configKey">
            <el-input
               v-model="queryParams.configKey"
               placeholder="请输入参数键名"
               clearable
             
               style="width: 240px"
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="系统内置" prop="configType">
            <el-select v-model="queryParams.configType" placeholder="系统内置" clearable size="small">
               <el-option
                  v-for="dict in sys_yes_no"
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
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="primary"
               plain
               icon="el-icon-plus"
             
               @click="handleAdd"
               v-hasPermi="['system:config:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               icon="el-icon-edit"
             
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['system:config:edit']"
            >修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="el-icon-delete"
             
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:config:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="el-icon-download"
             
               @click="handleExport"
               v-hasPermi="['system:config:export']"
            >导出</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="el-icon-refresh"
             
               @click="handleRefreshCache"
               v-hasPermi="['system:config:remove']"
            >刷新缓存</el-button>
         </el-col>
         <right-toolbar  :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="参数主键" align="center" prop="configId" />
         <el-table-column
            label="参数名称"
            align="center"
            prop="configName"
            :show-overflow-tooltip="true"
         />
         <el-table-column
            label="参数键名"
            align="center"
            prop="configKey"
            :show-overflow-tooltip="true"
         />
         <el-table-column label="参数键值" align="center" prop="configValue" />
         <el-table-column label="系统内置" align="center" prop="configType">
            <template #default="scope">
               <dict-tag :options="sys_yes_no" :value="scope.row.configType" />
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
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:config:edit']"
               >修改</el-button>
               <el-button
                
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:config:remove']"
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
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
         <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="参数名称" prop="configName">
               <el-input v-model="form.configName" placeholder="请输入参数名称" />
            </el-form-item>
            <el-form-item label="参数键名" prop="configKey">
               <el-input v-model="form.configKey" placeholder="请输入参数键名" />
            </el-form-item>
            <el-form-item label="参数键值" prop="configValue">
               <el-input v-model="form.configValue" placeholder="请输入参数键值" />
            </el-form-item>
            <el-form-item label="系统内置" prop="configType">
               <el-radio-group v-model="form.configType">
                  <el-radio
                     v-for="dict in sys_yes_no"
                     :key="dict.value"
                     :label="dict.value"
                  >{{ dict.label }}</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
               <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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