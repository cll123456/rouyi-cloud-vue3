<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import { useDict } from '../../../hooks/dict';
import { parseTime } from '../../../utils/ruoyi';
import Pagination from './../../../components/Pagination/index.vue';
import DictTag from './../../../components/DictTag/index.vue';
import selectUser from './selectUser.vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { allocatedUserList, authUserCancel, authUserCancelAll } from '../../../api/system/role';
import { Close, CircleClose, Search, Refresh, Plus } from '@element-plus/icons-vue'

const queryFormRef = ref(null);

const route = useRoute();
const router = useRouter();
const store = useStore();

/**查询参数 */
const queryParams = ref({
   pageSize: 10,
   roleId: route.params.roleId,
   userName: undefined,
   phonenumber: undefined
})

// 遮罩层
const loading = ref(true);
// 选中用户组
const userIds = ref([]);
// 非多个禁用
const multiple = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 总条数
const total = ref(0);
// 用户表格数据
const userList = ref([]);

/**select ref */
const selectRef = ref(null);

/** 查询授权用户列表 */
const getList = () => {
   loading.value = true;
   allocatedUserList(queryParams.value).then(response => {
      userList.value = response.rows;
      total.value = response.total;
      loading.value = false;
   }
   );
}
// 返回按钮
const handleClose = () => {
   store.dispatch("tagsView/delView", route);
   router.push({ path: "/system/role" });
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
   userIds.value = selection.map(item => item.userId)
   multiple.value = !selection.length
}
/** 打开授权用户表弹窗 */
const openSelectUser = () => {
   selectRef.value.show();
}
/** 取消授权按钮操作 */
const cancelAuthUser = (row) => {
   ElMessageBox.confirm('确认要取消该用户"' + row.userName + '"角色吗？', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return authUserCancel({ userId: row.userId, roleId: queryParams.value.roleId });
   }).then(() => {
      getList();
      ElMessage("取消授权成功");
   }).catch(() => { });
}
/** 批量取消授权按钮操作 */
const cancelAuthUserAll = (row) => {
   ElMessageBox.confirm('是否取消选中用户授权数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(() => {
      return authUserCancelAll({ roleId: queryParams.value.roleId, userIds: userIds.value.join(",") });
   }).then(() => {
      getList();
      ElMessage.success("取消授权成功");
   }).catch(() => { });
}

getList();
const { sys_normal_disable } = useDict('sys_normal_disable');


</script>
<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryFormRef" v-show="showSearch" :inline="true">
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
               @click="openSelectUser"
               v-hasPermi="['system:role:add']"
            >添加用户</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               :icon="CircleClose"
               :disabled="multiple"
               @click="cancelAuthUserAll"
               v-hasPermi="['system:role:remove']"
            >批量取消授权</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="warning" plain :icon="Close" @click="handleClose">关闭</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
         <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true" />
         <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
         <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true" />
         <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
               <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button
                  type="text"
                  :icon="CircleClose"
                  @click="cancelAuthUser(scope.row)"
                  v-hasPermi="['system:role:remove']"
               >取消授权</el-button>
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
      <select-user ref="selectRef" :roleId="queryParams.roleId" @ok="handleQuery" />
   </div>
</template>

<style lang='scss' scoped>
</style>