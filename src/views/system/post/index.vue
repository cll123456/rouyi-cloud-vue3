<script>
export default{
   name: 'Post'
}
</script>
<script setup>
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { ref } from '@vue/composition-api';
import Pagination from './../../../components/Pagination/index.vue';
import { Message, MessageBox } from 'element-ui';
import { useDict } from '../../../hooks/dict';
import { download, parseTime } from '../../../utils/ruoyi';
import { listPost, addPost, delPost, exportPost, getPost, updatePost } from '../../../api/system/post';
import DictTag from './../../../components/DictTag/index.vue';

/**search form ref */
const queryFormRef = ref(null);
// 遮罩层
const loading = ref(true)
// 选中数组
const ids = ref([])
// 非单个禁用
const single = ref(true)
// 非多个禁用
const multiple = ref(true)
// 显示搜索条件
const showSearch = ref(true)
// 总条数
const total = ref(0)
// 岗位表格数据
const postList = ref([])
// 弹出层标题
const title = ref("")
// 是否显示弹出层
const open = ref(false)
// 查询参数
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   postCode: undefined,
   postName: undefined,
   status: undefined
})
// 表单参数
const form = ref({
   postId: undefined,
   postCode: undefined,
   postName: undefined,
   postSort: 0,
   status: "0",
   remark: undefined
})

const formRef = ref(null);
// 表单校验
const rules = ref({
   postName: [
      { required: true, message: "岗位名称不能为空", trigger: "blur" }
   ],
   postCode: [
      { required: true, message: "岗位编码不能为空", trigger: "blur" }
   ],
   postSort: [
      { required: true, message: "岗位顺序不能为空", trigger: "blur" }
   ]
})

/** 查询岗位列表 */
const getList = () => {
   loading.value = true;
   listPost(queryParams.value).then(response => {
      postList.value = response.rows;
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
      postId: undefined,
      postCode: undefined,
      postName: undefined,
      postSort: 0,
      status: "0",
      remark: undefined
   };
   if(formRef.value){
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
   ids.value = selection.map(item => item.postId)
   single.value = selection.length != 1
   multiple.value = !selection.length
}
/** 新增按钮操作 */
const handleAdd = () => {
   reset();
   open.value = true;
   title.value = "添加岗位";
}
/** 修改按钮操作 */
const handleUpdate = (row) => {
   reset();
   const postId = row.postId || ids.value
   getPost(postId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改岗位";
   });
}
/** 提交按钮 */
const submitForm = () => {
   formRef.value.validate(valid => {
      if (valid) {
         if (form.value.postId != undefined) {
            updatePost(form.value).then(response => {
               Message.success("修改成功");
               open.value = false;
               getList();
            });
         } else {
            addPost(form.value).then(response => {
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
   const postIds = row.postId || ids.value;
   MessageBox.confirm('是否确认删除岗位编号为"' + postIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delPost(postIds);
   }).then(() => {
      getList();
      Message.success("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
const handleExport = () => {
   MessageBox.confirm('是否确认导出所有岗位数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return exportPost(queryParams.value);
   }).then(response => {
      download(response.msg);
   })
}


const { sys_normal_disable } = useDict('sys_normal_disable');

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
         <el-form-item label="岗位编码" prop="postCode">
            <el-input
               v-model="queryParams.postCode"
               placeholder="请输入岗位编码"
               clearable
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="岗位名称" prop="postName">
            <el-input
               v-model="queryParams.postName"
               placeholder="请输入岗位名称"
               clearable
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="岗位状态" clearable>
               <el-option
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="primary"
               plain
               icon="el-icon-plus"
               @click="handleAdd"
               v-hasPermi="['system:post:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               icon="el-icon-edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['system:post:edit']"
            >修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="el-icon-delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:post:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="el-icon-download"
               @click="handleExport"
               v-hasPermi="['system:post:export']"
            >导出</el-button>
         </el-col>
         <right-toolbar  :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="岗位编号" align="center" prop="postId" />
         <el-table-column label="岗位编码" align="center" prop="postCode" />
         <el-table-column label="岗位名称" align="center" prop="postName" />
         <el-table-column label="岗位排序" align="center" prop="postSort" />
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
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:post:edit']"
               >修改</el-button>
               <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:post:remove']"
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

      <!-- 添加或修改岗位对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
         <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="岗位名称" prop="postName">
               <el-input v-model="form.postName" placeholder="请输入岗位名称" />
            </el-form-item>
            <el-form-item label="岗位编码" prop="postCode">
               <el-input v-model="form.postCode" placeholder="请输入编码名称" />
            </el-form-item>
            <el-form-item label="岗位顺序" prop="postSort">
               <el-input-number v-model="form.postSort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="岗位状态" prop="status">
               <el-radio-group v-model="form.status">
                  <el-radio
                     v-for="dict in sys_normal_disable"
                     :key="dict.value"
                     :label="dict.value"
                  >{{ dict.label }}</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
               <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
         </div>
      </el-dialog>
   </div>
</template>

<style lang='scss' scoped>
</style>