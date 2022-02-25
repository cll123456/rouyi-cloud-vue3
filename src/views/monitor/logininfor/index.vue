<script setup>
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { ref } from 'vue';
import Pagination from './../../../components/Pagination/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDict } from '../../../hooks/dict';
import { download, parseTime, addDateRange } from '../../../utils/ruoyi';
import DictTag from './../../../components/DictTag/index.vue';
import { list, delLogininfor, cleanLogininfor, exportLoginInfo } from '../../../api/monitor/logininfor';
import { Sort, Search, Refresh, Plus, Delete, Edit, DeleteFilled, Download } from '@element-plus/icons-vue';
/***queryForm ref */
const queryFormRef = ref(null);
/**tables ref */
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
// 日期范围
const dateRange = ref([]);
// 默认排序
const defaultSort = ref({ prop: 'loginTime', order: 'descending' });
// 查询参数
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   ipaddr: undefined,
   userName: undefined,
   status: undefined,
   orderByColumn: undefined,
   isAsc: undefined
});

/** 查询登录日志列表 */
const getList = () => {
   loading.value = true;
   list(addDateRange(queryParams.value, dateRange.value)).then(response => {
      dataList.value = response.rows;
      total.value = response.total;
      loading.value = false;
   }
   );
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
   ids.value = selection.map(item => item.infoId)
   multiple.value = !selection.length
}
/** 排序触发事件 */
const handleSortChange = (column, prop, order) => {
   queryParams.value.orderByColumn = column.prop;
   queryParams.value.isAsc = column.order;
   getList();
}
/** 删除按钮操作 */
const handleDelete = (row) => {
   const infoIds = row.infoId || ids.value;
   ElMessageBox.confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delLogininfor(infoIds);
   }).then(() => {
      getList();
      ElMessage.success("删除成功");
      
   }).catch(() => { });
}
/** 清空按钮操作 */
const handleClean = () => {
   ElMessageBox.confirm('是否确认清空所有登录日志数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return cleanLogininfor();
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
      return exportLoginInfo(queryParams.value);
   }).then(response => {
      download(response.msg);
   })
}

const { sys_common_status } = useDict('sys_common_status');
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
         <el-form-item label="登录地址" prop="ipaddr">
            <el-input
               v-model="queryParams.ipaddr"
               placeholder="请输入登录地址"
               clearable
               style="width: 240px;"
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="用户名称" prop="userName">
            <el-input
               v-model="queryParams.userName"
               placeholder="请输入用户名称"
               clearable
               style="width: 240px;"
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select
               v-model="queryParams.status"
               placeholder="登录状态"
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
         <el-form-item label="登录时间">
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
               v-hasPermi="['system:logininfor:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               :icon="DeleteFilled"
               @click="handleClean"
               v-hasPermi="['system:logininfor:remove']"
            >清空</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               :icon="Download"
               @click="handleExport"
               v-hasPermi="['system:logininfor:export']"
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
         <el-table-column label="访问编号" align="center" prop="infoId" />
         <el-table-column
            label="用户名称"
            align="center"
            prop="userName"
            :show-overflow-tooltip="true"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
         />
         <el-table-column
            label="地址"
            align="center"
            prop="ipaddr"
            :show-overflow-tooltip="true"
         />
          <el-table-column
            label="登录地点"
            align="center"
            prop="loginLocation"
            :show-overflow-tooltip="true"
         />
          <el-table-column
            label="操作系统"
            align="center"
            prop="os"
            :show-overflow-tooltip="true"
         />
          <el-table-column
            label="浏览器"
            align="center"
            prop="browser"
            :show-overflow-tooltip="true"
         />
         <el-table-column label="登录状态" align="center" prop="status">
            <template #default="scope">
               <dict-tag :options="sys_common_status" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="描述" align="center" prop="msg" />
         <el-table-column
            label="访问时间"
            align="center"
            prop="loginTime"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            width="180"
         >
         </el-table-column>
      </el-table>

      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />
   </div>
</template>

<style lang='scss' scoped>
</style>