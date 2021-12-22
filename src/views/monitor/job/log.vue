
<script setup>
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { ref } from '@vue/composition-api';
import Pagination from './../../../components/Pagination/index.vue';
import { Message, MessageBox } from 'element-ui';
import { useDict } from '../../../hooks/dict';
import { download, parseTime, addDateRange } from '../../../utils/ruoyi';
import DictTag from './../../../components/DictTag/index.vue';
import { listJobLog, delJobLog, cleanJobLog, exportJobLog } from '../../../api/monitor/jobLog';

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
// 调度日志表格数据
const jobLogList = ref([]);
// 是否显示弹出层
const open = ref(false);
// 日期范围
const dateRange = ref([]);
// 表单参数
const form = ref({});
// 查询参数
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   jobName: undefined,
   jobGroup: undefined,
   status: undefined
});
/**queryForm ref */
const queryFormRef = ref(null);
/**form ref */
const formRef = ref(null);
import store from '@/store'
const route = router.currentRoute;
import router from '@/router';

/** 查询调度日志列表 */
const getList = () => {
   loading.value = true;
   listJobLog(addDateRange(queryParams.value, dateRange.value)).then(response => {
      jobLogList.value = response.rows;
      total.value = response.total;
      loading.value = false;
   }
   );
}
// 返回按钮
const handleClose = () => {
   store.dispatch("tagsView/delView", route);
   router.push({ path: "/monitor/job" });
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
// 多选框选中数据
const handleSelectionChange = (selection) => {
   ids.value = selection.map(item => item.jobLogId);
   multiple.value = !selection.length;
}
/** 详细按钮操作 */
const handleView = (row) => {
   open.value = true;
   form.value = row;
}
/** 删除按钮操作 */
const handleDelete = (row) => {
   MessageBox.confirm('是否确认删除调度日志编号为"' + ids.value + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delJobLog(ids.value);
   }).then(() => {
      getList();
      Message.success("删除成功");
   }).catch(() => { });
}
/** 清空按钮操作 */
const handleClean = () => {
   MessageBox.confirm("是否确认清空所有调度日志数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return cleanJobLog();
   }).then(() => {
      getList();
      Message.success("清空成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
const handleExport = () => {
   MessageBox.confirm('是否确认导出所有日志数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return exportJobLog(queryParams.value);
   }).then(response => {
      download(response.msg);
   })

}


const { sys_common_status, sys_job_group } = useDict('sys_common_status', 'sys_job_group');

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
         <el-form-item label="任务名称" prop="jobName">
            <el-input
               v-model="queryParams.jobName"
               placeholder="请输入任务名称"
               clearable
               style="width: 240px"
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="任务组名" prop="jobGroup">
            <el-select
               v-model="queryParams.jobGroup"
               placeholder="请任务组名"
               clearable
               style="width: 240px"
            >
               <el-option
                  v-for="dict in sys_job_group"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="执行状态" prop="status">
            <el-select
               v-model="queryParams.status"
               placeholder="请选择执行状态"
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
         <el-form-item label="执行时间">
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

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="el-icon-delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['monitor:job:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="el-icon-delete"
               @click="handleClean"
               v-hasPermi="['monitor:job:remove']"
            >清空</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="el-icon-download"
               @click="handleExport"
               v-hasPermi="['monitor:job:export']"
            >导出</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-close" @click="handleClose">关闭</el-button>
         </el-col>
         <right-toolbar  :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="jobLogList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="日志编号" width="80" align="center" prop="jobLogId" />
         <el-table-column label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true" />
         <el-table-column label="任务组名" align="center" prop="jobGroup" :show-overflow-tooltip="true">
            <template #default="scope">
               <dict-tag :options="sys_job_group" :value="scope.row.jobGroup" />
            </template>
         </el-table-column>
         <el-table-column
            label="调用目标字符串"
            align="center"
            prop="invokeTarget"
            :show-overflow-tooltip="true"
         />
         <el-table-column
            label="日志信息"
            align="center"
            prop="jobMessage"
            :show-overflow-tooltip="true"
         />
         <el-table-column label="执行状态" align="center" prop="status">
            <template #default="scope">
               <dict-tag :options="sys_common_status" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="执行时间" align="center" prop="createTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button
                  type="text"
                  icon="el-icon-view"
                  @click="handleView(scope.row)"
                  v-hasPermi="['monitor:job:query']"
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

      <!-- 调度日志详细 -->
      <el-dialog title="调度日志详细" :visible.sync="open" width="700px" append-to-body>
         <el-form ref="formRef" :model="form" label-width="100px">
            <el-row>
               <el-col :span="12">
                  <el-form-item label="日志序号：">{{ form.jobLogId }}</el-form-item>
                  <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="任务分组：">{{ form.jobGroup }}</el-form-item>
                  <el-form-item label="执行时间：">{{ form.createTime }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="调用方法：">{{ form.invokeTarget }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="日志信息：">{{ form.jobMessage }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="执行状态：">
                     <div v-if="form.status == 0">正常</div>
                     <div v-else-if="form.status == 1">失败</div>
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="异常信息：" v-if="form.status == 1">{{ form.exceptionInfo }}</el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button @click="open = false">关 闭</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<style lang='scss' scoped>
</style>