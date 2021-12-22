<script setup>
import { Message } from 'element-ui'
import { ref } from '@vue/composition-api';
import { authUserSelectAll, unallocatedUserList } from '../../../api/system/role';
import { useDict } from '../../../hooks/dict';
import { parseTime } from '../../../utils/ruoyi';
import Pagination from './../../../components/Pagination/index.vue';
import DictTag from './../../../components/DictTag/index.vue';

const props = defineProps({
   // 角色编号
   roleId: {
      type: [Number, String]
   }
})
const emit = defineEmits(['ok']);
/**queryForm ref */
const queryFormRef = ref(null);
/**查询参数 */
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   roleId: undefined,
   userName: undefined,
   phonenumber: undefined
})
/**table ref */
const tableRef = ref(null);
/**用户列表 */
const userList = ref([]);
/**总条数 */
const total = ref(0);
/** 遮罩层*/
const visible = ref(false);
/** 选中数组值*/
const userIds = ref([]);

// 显示弹框
const show = () => {
   queryParams.value.roleId = props.roleId;
   getList();
   visible.value = true;
}
/**选择行 */
const clickRow = (row) => {
   tableRef.value.toggleRowSelection(row);
}
// 多选框选中数据
const handleSelectionChange = (selection) => {
   userIds.value = selection.map(item => item.userId);
}
// 查询表数据
const getList = () => {
   unallocatedUserList(queryParams.value).then(res => {
      userList.value = res.rows;
      total.value = res.total;
   });
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
/** 选择授权用户操作 */
const handleSelectUser = () => {
   authUserSelectAll({ roleId: queryParams.value.roleId, userIds: userIds.value.join(",") }).then(res => {
      Message.success(res.msg);
      if (res.code === 200) {
         visible.value = false;
         emit("ok");
      }
   });
}
// 对外暴露一个show方法
defineExpose({
   show,
});

const { sys_normal_disable } = useDict('sys_normal_disable');


</script>
<template>
   <div>
      <!-- 授权用户 -->
      <el-dialog title="选择用户" :visible.sync="visible" width="800px" top="5vh" append-to-body>
         <el-form :model="queryParams" ref="queryFormRef" :inline="true">
            <el-form-item label="用户名称" prop="userName">
               <el-input
                  v-model="queryParams.userName"
                  placeholder="请输入用户名称"
                  clearable
                  @keyup.enter.native="handleQuery"
               />
            </el-form-item>
            <el-form-item label="手机号码" prop="phonenumber">
               <el-input
                  v-model="queryParams.phonenumber"
                  placeholder="请输入手机号码"
                  clearable
                  @keyup.enter.native="handleQuery"
               />
            </el-form-item>
            <el-form-item>
               <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
               <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
         </el-form>
         <el-row>
            <el-table
               @row-click="clickRow"
               ref="tableRef"
               :data="userList"
               @selection-change="handleSelectionChange"
               height="260px"
            >
               <el-table-column type="selection" width="55"></el-table-column>
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
            </el-table>
            <pagination
               v-show="total > 0"
               :total="total"
               v-model:page="queryParams.pageNum"
               v-model:limit="queryParams.pageSize"
               @pagination="getList"
            />
         </el-row>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="handleSelectUser">确 定</el-button>
               <el-button @click="visible = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<style lang='scss' scoped>
</style>