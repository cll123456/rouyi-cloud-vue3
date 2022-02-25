<script setup>
import { ref } from 'vue';
import Pagination from './../../../components/Pagination/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {  parseTime, } from '../../../utils/ruoyi';
import { forceLogout, list as initData } from '../../../api/monitor/online';
import {  Search, Refresh,Delete  } from '@element-plus/icons-vue';

// 遮罩层
const loading = ref(true)
// 总条数
const total = ref(0)
// 表格数据
const list = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
// 查询参数
const queryParams = ref({
   ipaddr: undefined,
   userName: undefined
})

/**queryForm ref */
const queryFormRef = ref(null);

/** 查询登录日志列表 */
const getList = () => {
   loading.value = true;
   initData(queryParams.value).then(response => {
      list.value = response.rows;
      total.value = response.total;
      loading.value = false;
   });
}
/** 搜索按钮操作 */
const handleQuery = () => {
   pageNum.value = 1;
   getList();
}
/** 重置按钮操作 */
const resetQuery = () => {
   queryFormRef.value.resetFields();
   handleQuery();
}
/** 强退按钮操作 */
const handleForceLogout = (row) => {
   ElMessageBox.confirm('是否确认强退名称为"' + row.userName + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return forceLogout(row.tokenId);
   }).then(() => {
      getList();
      ElMessage.success("强退成功");
   }).catch(() => { });
}

getList();
</script>
<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
         <el-form-item label="登录地址" prop="ipaddr">
            <el-input
               v-model="queryParams.ipaddr"
               placeholder="请输入登录地址"
               clearable
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="用户名称" prop="userName">
            <el-input
               v-model="queryParams.userName"
               placeholder="请输入用户名称"
               clearable
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>
      <el-table
         v-loading="loading"
         :data="list.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
         style="width: 100%;"
      >
         <el-table-column label="序号" type="index" align="center">
            <template #default="scope">
               <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
         </el-table-column>
         <el-table-column label="会话编号" align="center" prop="tokenId" :show-overflow-tooltip="true" />
         <el-table-column
            label="登录名称"
            align="center"
            prop="userName"
            :show-overflow-tooltip="true"
         />
         <el-table-column
            label="所属部门"
            align="center"
            prop="deptName"
            :show-overflow-tooltip="true"
         />
         <el-table-column label="主机" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
         <el-table-column
            label="登录地点"
            align="center"
            prop="loginLocation"
            :show-overflow-tooltip="true"
         />
         <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
         <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
         <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.loginTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button
                  type="text"
                  :icon="Delete"
                  @click="handleForceLogout(scope.row)"
                  v-hasPermi="['monitor:online:forceLogout']"
               >强退</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="pageNum"
         v-model:limit="pageSize"
      />
   </div>
</template>

<style lang='scss' scoped>
</style>