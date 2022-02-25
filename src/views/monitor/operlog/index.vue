<script setup>
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { ref } from 'vue';
import Pagination from './../../../components/Pagination/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDict } from '../../../hooks/dict';
import { download, parseTime, addDateRange, selectDictLabel } from '../../../utils/ruoyi';
import DictTag from './../../../components/DictTag/index.vue';
import { exportOperlog, list, delOperlog, cleanOperlog } from '../../../api/monitor/operlog';
import { Sort, Search, Refresh, Plus, Delete, DeleteFilled, View,Download } from '@element-plus/icons-vue';



/***queryForm ref */
const queryFormRef = ref(null);
/**form ref */
const formRef = ref(null);
/**tables  ref */
const tablesRef = ref(null);

// 遮罩层
const loading = ref(true);
// 选中数组
const ids = ref([]);
// 非多个禁用
const multiple = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 总条数
const total = ref(0);
// 表格数据
const dataList = ref([]);
// 是否显示弹出层
const open = ref(false);
// 日期范围
const dateRange = ref([]);
// 默认排序
const defaultSort = ref({ prop: 'operTime', order: 'descending' });
// 表单参数
const form = ref({});
// 查询参数
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   title: undefined,
   operName: undefined,
   businessType: undefined,
   status: undefined
});

/** 查询登录日志 */
const getList = () => {
   loading.value = true;
   list(addDateRange(queryParams.value, dateRange.value)).then(response => {
      dataList.value = response.rows;
      total.value = response.total;
      loading.value = false;
   }
   );
}
// 操作日志类型字典翻译
const typeFormat = (row, column) => {
   return selectDictLabel(sys_oper_type.value, row.businessType);
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
   tablesRef.value.sort(defaultSort.value.prop, defaultSort.value.order)
   handleQuery();
}
/** 多选框选中数据 */
const handleSelectionChange = (selection) => {
   ids.value = selection.map(item => item.operId)
   multiple.value = !selection.length
}
/** 排序触发事件 */
const handleSortChange = (column, prop, order) => {
   queryParams.value.orderByColumn = column.prop;
   queryParams.value.isAsc = column.order;
   getList();
}
/** 详细按钮操作 */
const handleView = (row) => {
   open.value = true;
   form.value = row;
}
/** 删除按钮操作 */
const handleDelete = (row) => {
   const operIds = row.operId || ids.value;
   ElMessageBox.confirm('是否确认删除日志编号为"' + operIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delOperlog(operIds);
   }).then(() => {
      getList();
      ElMessage.success("删除成功");
   }).catch(() => { });
}
/** 清空按钮操作 */
const handleClean = () => {
   ElMessageBox.confirm('是否确认清空所有操作日志数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return cleanOperlog();
   }).then(() => {
      getList();
      ElMessage.success("清空成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
const handleExport = () => {
   ElMessageBox.confirm('是否确认导出所有登录日志数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return exportOperlog(queryParams.value);
   }).then(response => {
      download(response.msg);
   })


}
const { sys_oper_type, sys_common_status } = useDict('sys_oper_type', 'sys_common_status');

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
         <el-form-item label="系统模块" prop="title">
            <el-input
               v-model="queryParams.title"
               placeholder="请输入系统模块"
               clearable
               style="width: 240px;"
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="操作人员" prop="operName">
            <el-input
               v-model="queryParams.operName"
               placeholder="请输入操作人员"
               clearable
               style="width: 240px;"
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="类型" prop="businessType">
            <el-select
               v-model="queryParams.businessType"
               placeholder="操作类型"
               clearable
               style="width: 240px"
            >
               <el-option
                  v-for="dict in sys_oper_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select
               v-model="queryParams.status"
               placeholder="操作状态"
               clearable
               style="width: 240px"
            >
               <el-option
                  v-for="dict in sys_common_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="操作时间">
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
               type="danger"
               plain
               :icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:operlog:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               :icon="DeleteFilled"
               @click="handleClean"
               v-hasPermi="['system:operlog:remove']"
            >清空</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               :icon="Download"
               @click="handleExport"
               v-hasPermi="['system:operlog:export']"
            >导出</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table
         ref="tablesRef"
         v-loading="loading"
         :data="dataList"
         @selection-change="handleSelectionChange"
         :default-sort="defaultSort"
         @sort-change="handleSortChange"
      >
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="日志编号" align="center" prop="operId" />
         <el-table-column label="系统模块" align="center" prop="title" />
         <el-table-column label="操作类型" align="center" prop="businessType">
            <template #default="scope">
               <dict-tag :options="sys_oper_type" :value="scope.row.businessType" />
            </template>
         </el-table-column>
         <el-table-column label="请求方式" align="center" prop="requestMethod" />
         <el-table-column
            label="操作人员"
            align="center"
            prop="operName"
            :show-overflow-tooltip="true"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            width="100"
         />
         <el-table-column
            label="主机"
            align="center"
            prop="operIp"
            width="130"
            :show-overflow-tooltip="true"
         />
         <el-table-column label="操作状态" align="center" prop="status">
            <template #default="scope">
               <dict-tag :options="sys_common_status" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column
            label="操作日期"
            align="center"
            prop="operTime"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            width="180"
         >
            <template #default="scope">
               <span>{{ parseTime(scope.row.operTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button
                  type="text"
                  :icon="View"
                  @click="handleView(scope.row, scope.index)"
                  v-hasPermi="['system:operlog:query']"
               >详细</el-button>
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

      <!-- 操作日志详细 -->
      <el-dialog title="操作日志详细" v-model="open" width="700px" append-to-body>
         <el-form ref="formRef" :model="form" label-width="100px">
            <el-row>
               <el-col :span="12">
                  <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
                  <el-form-item label="登录信息：">{{ form.operName }} / {{ form.operIp }}</el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
                  <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="操作状态：">
                     <div v-if="form.status === 0">正常</div>
                     <div v-else-if="form.status === 1">失败</div>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click="open = false">关 闭</el-button>
         </div>
      </el-dialog>
   </div>
</template>

<style lang='scss' scoped>
</style>