<script setup>
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { ref } from 'vue';
import Pagination from './../../../components/Pagination/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDict } from '../../../hooks/dict';
import { download, parseTime, selectDictLabel } from '../../../utils/ruoyi';
import DictTag from './../../../components/DictTag/index.vue';
import { listJob, getJob, delJob, addJob, updateJob, runJob, changeJobStatus, exportJob } from '../../../api/monitor/job';
import { useRouter } from 'vue-router';
import { View, Search, Refresh, Plus, Delete, Edit, DArrowRight, Download, Operation, CaretRight } from '@element-plus/icons-vue';

/**queryForm ref */
const queryFormRef = ref(null);

/**form ref */
const formRef = ref(null);

const router = useRouter();
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
// 定时任务表格数据
const jobList = ref([]);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
// 是否显示详细弹出层
const openView = ref(false);
// 是否显示Cron表达式弹出层
const openCron = ref(false);
// 传入的表达式
const expression = ref("");
// 查询参数
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   jobName: undefined,
   jobGroup: undefined,
   status: undefined
});
// 表单参数
const form = ref({
   jobId: undefined,
   jobName: undefined,
   jobGroup: undefined,
   invokeTarget: undefined,
   cronExpression: undefined,
   misfirePolicy: 1,
   concurrent: 1,
   status: "0"
});
// 表单校验
const rules = ref({
   jobName: [{ required: true, message: "任务名称不能为空", trigger: "blur" }],
   invokeTarget: [{ required: true, message: "调用目标字符串不能为空", trigger: "blur" }],
   cronExpression: [{ required: true, message: "cron执行表达式不能为空", trigger: "blur" }]
});

/** 查询定时任务列表 */
const getList = () => {
   loading.value = true;
   listJob(queryParams.value).then(response => {
      jobList.value = response.rows;
      total.value = response.total;
      loading.value = false;
   });
}
// 任务组名字典翻译
const jobGroupFormat = (row, column) => {
   return selectDictLabel(sys_job_group.value, row.jobGroup);
}
// 取消按钮
const cancel = () => {
   open.value = false;
   reset();
}
// 表单重置
const reset = () => {
   form.value = {
      jobId: undefined,
      jobName: undefined,
      jobGroup: undefined,
      invokeTarget: undefined,
      cronExpression: undefined,
      misfirePolicy: 1,
      concurrent: 1,
      status: "0"
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
   queryFormRef.value.resetFields();
   handleQuery();
}
// 多选框选中数据
const handleSelectionChange = (selection) => {
   ids.value = selection.map(item => item.jobId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
// 更多操作触发
const handleCommand = (command, row) => {
   switch (command) {
      case "handleRun":
         handleRun(row);
         break;
      case "handleView":
         handleView(row);
         break;
      case "handleJobLog":
         handleJobLog(row);
         break;
      default:
         break;
   }
}
// 任务状态修改
const handleStatusChange = (row) => {
   let text = row.status === "0" ? "启用" : "停用";
   ElMessageBox.confirm('确认要"' + text + '""' + row.jobName + '"任务吗?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return changeJobStatus(row.jobId, row.status);
   }).then(() => {
      ElMessage.success(text + "成功");
   }).catch(function () {
      row.status = row.status === "0" ? "1" : "0";
   });
}
/* 立即执行一次 */
const handleRun = (row) => {
   ElMessageBox.confirm('确认要立即执行一次"' + row.jobName + '"任务吗?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return runJob(row.jobId, row.jobGroup);
   }).then(() => {
      ElMessage.success("执行成功");
   }).catch(() => { });
}
/** 任务详细信息 */
const handleView = (row) => {
   getJob(row.jobId).then(response => {
      form.value = response.data;
      openView.value = true;
   });
}
/** cron表达式按钮操作 */
const handleShowCron = () => {
   expression.value = form.value.cronExpression;
   openCron.value = true;
}
/** 确定后回传值 */
const crontabFill = (value) => {
   form.value.cronExpression = value;
}
/** 任务日志列表查询 */
const handleJobLog = (row) => {
   const jobId = row.jobId || 0;
   router.push({ path: '/monitor/job-log/index', query: { jobId: jobId } })
}
/** 新增按钮操作 */
const handleAdd = () => {
   reset();
   open.value = true;
   title.value = "添加任务";
}
/** 修改按钮操作 */
const handleUpdate = (row) => {
   reset();
   const jobId = row.jobId || ids;
   getJob(jobId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改任务";
   });
}
/** 提交按钮 */
const submitForm = () => {
   formRef.value.validate(valid => {
      if (valid) {
         if (form.value.jobId != undefined) {
            updateJob(form.value).then(response => {
               ElMessage.success("修改成功");
               open.value = false;
               getList();
            });
         } else {
            addJob(form.value).then(response => {
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
   const jobIds = row.jobId || ids;
   ElMessageBox.confirm('是否确认删除定时任务编号为"' + jobIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delJob(jobIds);
   }).then(() => {
      getList();
      ElMessage.success("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
const handleExport = () => {
   ElMessageBox.confirm('是否确认导出所有定时任务数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return exportJob(queryParams.value);
   }).then(response => {
      download(response.msg);
   })

}

const { sys_job_group, sys_job_status } = useDict('sys_job_group', 'sys_job_status');

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
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="任务组名" prop="jobGroup">
            <el-select v-model="queryParams.jobGroup" placeholder="请选择任务组名" clearable>
               <el-option
                  v-for="dict in sys_job_group"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="任务状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择任务状态" clearable>
               <el-option
                  v-for="dict in sys_job_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
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
               v-hasPermi="['monitor:job:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               :icon="Edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['monitor:job:edit']"
            >修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               :icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['monitor:job:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               :icon="Download"
               @click="handleExport"
               v-hasPermi="['monitor:job:export']"
            >导出</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="info"
               plain
               :icon="Operation"
               @click="handleJobLog"
               v-hasPermi="['monitor:job:query']"
            >日志</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="jobList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="任务编号" width="100" align="center" prop="jobId" />
         <el-table-column label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true" />
         <el-table-column label="任务组名" align="center" prop="jobGroup">
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
            label="cron执行表达式"
            align="center"
            prop="cronExpression"
            :show-overflow-tooltip="true"
         />
         <el-table-column label="状态" align="center">
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
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
         >
            <template #default="scope">
               <el-button
                  type="text"
                  :icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['monitor:job:edit']"
               >修改</el-button>
               <el-button
                  type="text"
                  :icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['monitor:job:remove']"
               >删除</el-button>
               <el-dropdown @command="(command) => handleCommand(command, scope.row)">
                  <el-button
                     type="text"
                     class="el-dropdown-link"
                     v-hasPermi="['monitor:job:changeStatus', 'monitor:job:query']"
                     :icon="DArrowRight"
                  >更多</el-button>
                  <template #dropdown>
                     <el-dropdown-menu>
                        <el-dropdown-item command="handleRun">
                           <span v-hasPermi="['monitor:job:changeStatus']" :icon="CaretRight">执行一次</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="handleView">
                           <span v-hasPermi="['monitor:job:query']" :icon="View">任务详细</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="handleJobLog">
                           <span v-hasPermi="['monitor:job:query']" :icon="Operation">调度日志</span>
                           调度日志
                        </el-dropdown-item>
                     </el-dropdown-menu>
                  </template>
               </el-dropdown>
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

      <!-- 添加或修改定时任务对话框 -->
      <el-dialog :title="title" v-model="open" width="800px" append-to-body>
         <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
            <el-row>
               <el-col :span="12">
                  <el-form-item label="任务名称" prop="jobName">
                     <el-input v-model="form.jobName" placeholder="请输入任务名称" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="任务分组" prop="jobGroup">
                     <el-select v-model="form.jobGroup" placeholder="请选择">
                        <el-option
                           v-for="dict in sys_job_group"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"
                        ></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item prop="invokeTarget">
                     <template #label>
                        <span>
                           调用方法
                           <el-tooltip placement="top">
                              <template #content>
                                 <div>
                                    Bean调用示例：ryTask.ryParams('ry')
                                    <br />Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')
                                    <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                                 </div>
                              </template>
                              <i class="el-icon-question"></i>
                           </el-tooltip>
                        </span>
                     </template>
                     <el-input v-model="form.invokeTarget" placeholder="请输入调用目标字符串" />
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="cron表达式" prop="cronExpression">
                     <el-input v-model="form.cronExpression" placeholder="请输入cron执行表达式">
                        <template #append>
                           <el-button type="primary" @click="handleShowCron">
                              生成表达式
                              <i class="el-icon-time el-icon--right"></i>
                           </el-button>
                        </template>
                     </el-input>
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="错误策略" prop="misfirePolicy">
                     <el-radio-group v-model="form.misfirePolicy">
                        <el-radio-button label="1">立即执行</el-radio-button>
                        <el-radio-button label="2">执行一次</el-radio-button>
                        <el-radio-button label="3">放弃执行</el-radio-button>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="是否并发" prop="concurrent">
                     <el-radio-group v-model="form.concurrent">
                        <el-radio-button label="0">允许</el-radio-button>
                        <el-radio-button label="1">禁止</el-radio-button>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="状态">
                     <el-radio-group v-model="form.status">
                        <el-radio
                           v-for="dict in sys_job_status"
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
      <!-- Cron表达式生成器 需要在写 -->
      <!-- <el-dialog title="Cron表达式生成器" v-model="openCron" append-to-body class="scrollbar">
      <div>32323</div>
         <crontab @hide="openCron = false" @fill="crontabFill" :expression="expression"></crontab> 
      </el-dialog>-->

      <!-- 任务日志详细 -->
      <el-dialog title="任务详细" v-model="openView" width="700px" append-to-body>
         <el-form :model="form" label-width="120px">
            <el-row>
               <el-col :span="12">
                  <el-form-item label="任务编号：">{{ form.jobId }}</el-form-item>
                  <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="任务分组：">{{ jobGroupFormat(form) }}</el-form-item>
                  <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="cron表达式：">{{ form.cronExpression }}</el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="下次执行时间：">{{ parseTime(form.nextValidTime) }}</el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="调用目标方法：">{{ form.invokeTarget }}</el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="任务状态：">
                     <div v-if="form.status == 0">正常</div>
                     <div v-else-if="form.status == 1">失败</div>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="是否并发：">
                     <div v-if="form.concurrent == 0">允许</div>
                     <div v-else-if="form.concurrent == 1">禁止</div>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="执行策略：">
                     <div v-if="form.misfirePolicy == 0">默认策略</div>
                     <div v-else-if="form.misfirePolicy == 1">立即执行</div>
                     <div v-else-if="form.misfirePolicy == 2">执行一次</div>
                     <div v-else-if="form.misfirePolicy == 3">放弃执行</div>
                  </el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button @click="openView = false">关 闭</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<style lang='scss' scoped>
</style>
