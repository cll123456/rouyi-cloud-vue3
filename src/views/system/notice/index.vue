<script setup>
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { ref } from 'vue';
import Pagination from './../../../components/Pagination/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDict } from '../../../hooks/dict';
import { parseTime } from '../../../utils/ruoyi';
import DictTag from './../../../components/DictTag/index.vue';
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from '../../../api/system/notice';
import {  Search, Refresh, Plus, Delete, Edit } from '@element-plus/icons-vue';
/***queryForm ref */
const queryFormRef = ref(null);
/**form ref */
const formRef = ref(null);
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
// 公告表格数据
const noticeList = ref([]);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
// 查询参数
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   noticeTitle: undefined,
   createBy: undefined,
   status: undefined
});
// 表单参数
const form = ref({
   noticeId: undefined,
   noticeTitle: undefined,
   noticeType: undefined,
   noticeContent: undefined,
   status: "0"
});
// 表单校验
const rules = ref({
   noticeTitle: [
      { required: true, message: "公告标题不能为空", trigger: "blur" }
   ],
   noticeType: [
      { required: true, message: "公告类型不能为空", trigger: "change" }
   ]
});

/** 查询公告列表 */
const getList = () => {
   loading.value = true;
   listNotice(queryParams.value).then(response => {
      noticeList.value = response.rows;
      total.value = response.total;
      loading.value = false;
   });
}
// 取消按钮
const cancel = () => {
   open.value = false;
   reset();
}
// 表单重置
const reset = () => {
   form.value = {
      noticeId: undefined,
      noticeTitle: undefined,
      noticeType: undefined,
      noticeContent: undefined,
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
   ids.value = selection.map(item => item.noticeId)
   single.value = selection.length != 1
   multiple.value = !selection.length
}
/** 新增按钮操作 */
const handleAdd = () => {
   reset();
   open.value = true;
   title.value = "添加公告";
}
/**修改按钮操作 */
const handleUpdate = (row) => {
   reset();
   const noticeId = row.noticeId || ids.value
   getNotice(noticeId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改公告";
   });
}
/** 提交按钮 */
const submitForm = () => {
   formRef.value.validate(valid => {
      if (valid) {
         if (form.value.noticeId != undefined) {
            updateNotice(form.value).then(response => {
               ElMessage.success("修改成功");
               open.value = false;
               getList();
            });
         } else {
            addNotice(form.value).then(response => {
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
   const noticeIds = row.noticeId || ids.value
   ElMessageBox.confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delNotice(noticeIds);
   }).then(() => {
      getList();
      ElMessage.success("删除成功");
   }).catch(() => { });
}

const { sys_notice_status, sys_notice_type } = useDict('sys_notice_status', 'sys_notice_type');
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
         <el-form-item label="公告标题" prop="noticeTitle">
            <el-input
               v-model="queryParams.noticeTitle"
               placeholder="请输入公告标题"
               clearable
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="操作人员" prop="createBy">
            <el-input
               v-model="queryParams.createBy"
               placeholder="请输入操作人员"
               clearable
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="类型" prop="noticeType">
            <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable>
               <el-option
                  v-for="dict in sys_notice_type"
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
               v-hasPermi="['system:notice:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               :icon="Edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['system:notice:edit']"
            >修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               :icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:notice:remove']"
            >删除</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="序号" align="center" prop="noticeId" width="100" />
         <el-table-column
            label="公告标题"
            align="center"
            prop="noticeTitle"
            :show-overflow-tooltip="true"
         />
         <el-table-column label="公告类型" align="center" prop="noticeType" width="100">
            <template #default="scope">
               <dict-tag :options="sys_notice_type" :value="scope.row.noticeType" />
            </template>
         </el-table-column>
         <el-table-column label="状态" align="center" prop="status" width="100">
            <template #default="scope">
               <dict-tag :options="sys_notice_status" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="创建者" align="center" prop="createBy" width="100" />
         <el-table-column label="创建时间" align="center" prop="createTime" width="100">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button
                  type="text"
                  :icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:notice:edit']"
               >修改</el-button>
               <el-button
                  type="text"
                  :icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:notice:remove']"
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

      <!-- 添加或修改公告对话框 -->
      <el-dialog :title="title" v-model="open" width="780px" append-to-body>
         <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-row>
               <el-col :span="12">
                  <el-form-item label="公告标题" prop="noticeTitle">
                     <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="公告类型" prop="noticeType">
                     <el-select v-model="form.noticeType" placeholder="请选择">
                        <el-option
                           v-for="dict in sys_notice_type"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"
                        ></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="状态">
                     <el-radio-group v-model="form.status">
                        <el-radio
                           v-for="dict in sys_notice_status"
                           :key="dict.value"
                           :label="dict.value"
                        >{{ dict.label }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="内容">
                     <!-- todo 这个地方可以换成富文本框 -->
                     <el-input
                        :rows="2"
                        type="textarea"
                        placeholder="请输入通知内容"
                        v-model="form.noticeContent"
                     />
                     <!-- <editor v-model="form.noticeContent" :min-height="192" /> -->
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
   </div>
</template>

<style lang='scss' scoped>
</style>