<script setup>
import { ElMessage } from 'element-plus';
import { ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { refreshToken } from '../../../api/login';
import { getAuthRole, updateAuthRole } from '../../../api/system/user';
import { parseTime } from '../../../utils/ruoyi';
import Pagination from './../../../components/Pagination/index.vue';

/**仓库 */
const store = useStore();
const router = useRouter();
const route = useRoute();
/**遮罩层 */
const loading = ref(true);
/**分页信息*/
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);
/** 选中角色编号*/
const roleIds = ref([]);
/*** 角色信息*/
const roles = ref([]);
/** 用户信息*/
const form = ref({
   nickName: undefined,
   userName: undefined,
   userId: undefined,
});
/**form ref */
const formRef = ref(null);
/**table ref */
const tableRef = ref(null);


/** 单击选中行数据 */
const clickRow = (row) => {
   tableRef.value.toggleRowSelection(row);
}
// 多选框选中数据
const handleSelectionChange = (selection) => {
   roleIds.value = selection.map((item) => item.roleId);
}
/**保存选中的数据编号 */
const getRowKey = (row) => {
   return row.roleId;
}
/** 关闭按钮 */
const close = () => {
   store.dispatch("tagsView/delView", route);
   router.push({ path: "/system/user" });
}
/** 提交按钮 */
const submitForm = () => {
   const userId = form.value.userId;
   const rIds = roleIds.value.join(",");
   updateAuthRole({ userId: userId, roleIds: rIds }).then((response) => {
      ElMessage.success("授权成功");
      close();
   });
}
/**初始化就需要执行的代码 */
(() => {
   const userId = route.params && route.params.userId;
   if (userId) {
      loading.value = true;
      getAuthRole(userId).then((response) => {
         form.value = response.user;
         roles.value = response.roles;
         total.value = roles.value.length;
         nextTick(() => {
            roles.value.forEach((row) => {
               if (row.flag) {
                  tableRef.value.toggleRowSelection(row);
               }
            });
         });
         loading.value = false;
      });
   }
})()

</script>
<template>
   <div class="app-container">
      <h4 class="form-header h4">基本信息</h4>
      <el-form ref="formRef" :model="form" label-width="80px">
         <el-row>
            <el-col :span="8" :offset="2">
               <el-form-item label="用户昵称" prop="nickName">
                  <el-input v-model="form.nickName" readonly />
               </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
               <el-form-item label="登录账号" prop="phonenumber"> 
                  <el-input v-model="form.userName" readonly />
               </el-form-item>
            </el-col>
         </el-row>
      </el-form>

      <h4 class="form-header h4">角色信息</h4>
      <el-table
         v-loading="loading"
         :row-key="getRowKey"
         @row-click="clickRow"
         ref="tableRef"
         @selection-change="handleSelectionChange"
         :data="roles.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
      >
         <el-table-column label="序号" type="index" align="center">
            <template #default="scope">
               <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
         </el-table-column>
         <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
         <el-table-column label="角色编号" align="center" prop="roleId" />
         <el-table-column label="角色名称" align="center" prop="roleName" />
         <el-table-column label="权限字符" align="center" prop="roleKey" />
         <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />

      <div style="display: flex;justify-content: center;margin-top: 30px;">
         <el-button type="primary" @click="submitForm()">提交</el-button>
         <el-button @click="close()">返回</el-button>
      </div>
   </div>
</template>

<style lang='scss' scoped>
</style>