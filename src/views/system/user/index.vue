<script>
export default{
   name: 'User'
}

</script>
<script setup>
import { ref, watch, nextTick } from '@vue/composition-api';
import { useDict } from '../../../hooks/dict';
import { treeselect } from '../../../api/system/dept';
import RightToolbar from './../../../components/RightToolbar/index.vue'
import { changeUserStatus, listUser, exportUser, resetUserPwd, delUser, importUserTemplate, getUser, updateUser, addUser } from '../../../api/system/user';
import { addDateRange, download, parseTime } from '../../../utils/ruoyi';
import Pagination from './../../../components/Pagination/index.vue'
import { Message, MessageBox } from 'element-ui';
import { getToken } from '../../../utils/auth';
import { PUBLIC_PATH } from '../../../config/commonConfig';
import TreeSelect from './../../../components/TreeSelect/index.vue'

import router from '@/router';
/**
 * 部门名称
 */
const deptName = ref('');

/**
 * 部门选项树
 */
const deptOptions = ref(undefined);
/**
 * 默认树的选项
 */
const defaultProps = ref({
   children: "children",
   label: "label"
})
/**
 * 部门树的ref
 */
const deptTreeRef = ref(null);

/**
 * 通过条件过滤节点
 */
const filterNode = (value, data) => {
   if (!value) return true
   return data.label.indexOf(value) !== -1
}
/**
 * 监听输入框的变化，查找内容
 */
watch(deptName, (val) => {
   deptTreeRef.value.filter(val);
})

/** 查询部门下拉树结构 */
const getTreeselect = () => {
   treeselect().then(response => {
      deptOptions.value = response.data;
   });
}

/**
 * 查询条件
 */
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   userName: undefined,
   phonenumber: undefined,
   status: undefined,
   deptId: undefined
})
/**
 * 日期
 */
const dateRange = ref([])
/**
 * 条件查询ref
 */
const queryFormRef = ref(null);
/**
 * 默认显示条件
 */
const showSearch = ref(true);

/**
 * 表格loading
 */
const loading = ref(true);
/**
 * 表单数据
 */
const list = ref([]);

/**
 * 总条数
 */
const total = ref(0);

/**
 * 初始化数据
 */
const getList = () => {
   loading.value = true;
   listUser(addDateRange(queryParams.value, dateRange.value)).then(res => {
      loading.value = false;
      list.value = res.rows;
      total.value = res.total;
   })
}

/**
 * 点击树的节点，每个部门里面的用户
 */
const handleNodeClick = (data) => {
   queryParams.value.deptId = data.id;
   getList();
}
/**
 * 条件查询
 */
const handleQuery = () => {
   queryParams.value.pageNum = 1;
   getList();
}

/**
 * 重置查询
 */
const resetQuery = () => {
   dateRange.value = [];
   queryParams.value.deptId = undefined;
   queryFormRef.value.resetFields();
   handleQuery();
}
/**
 * 非单个禁用
 */
const single = ref(true)
/**
 * 选中多个进行删除
 */
const multiple = ref(true)
/**选中删除的id */
const ids = ref([]);

// 列信息
const columns = ref([
   { key: 0, label: `用户编号`, visible: true },
   { key: 1, label: `用户名称`, visible: true },
   { key: 2, label: `用户昵称`, visible: true },
   { key: 3, label: `部门`, visible: true },
   { key: 4, label: `手机号码`, visible: true },
   { key: 5, label: `状态`, visible: true },
   { key: 6, label: `创建时间`, visible: true }
])


/**
 * 删除
 */
const handleDelete = (row) => {
   const userIds = row.userId || ids.value;
   MessageBox.confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delUser(userIds);
   }).then(() => {
      getList();
      Message.success("删除成功");
   }).catch(() => { });
}

/**
 * 导出
 */
const handleExport = () => {
   MessageBox.confirm('是否确认导出所有用户数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return exportUser(queryParams.value);
   }).then(response => {
      download(response.msg);
   })
}
/**
 * 用户状态修改 
 */
const handleStatusChange = (row) => {
   let text = row.status === "0" ? "启用" : "停用";
   MessageBox.confirm('确认要"' + text + '""' + row.userName + '"用户吗?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return changeUserStatus(row.userId, row.status);
   }).then(() => {
      Message.success(text + "成功");
   }).catch(function () {
      row.status = row.status === "0" ? "1" : "0";
   });
}
/**更多操作 */
const handleCommand = (command, row) => {
   switch (command) {
      case "handleResetPwd":
         handleResetPwd(row);
         break;
      case "handleAuthRole":
         handleAuthRole(row);
         break;
      default:
         break;
   }
}
/**跳转角色分配 */
const handleAuthRole = (row) => {
   const userId = row.userId;
   router.push("/system/user-auth/role/" + userId);
}

/** 重置密码按钮操作 */
const handleResetPwd = (row) => {
   MessageBox.prompt('请输入"' + row.userName + '"的新密码', "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
   }).then(({ value }) => {
      resetUserPwd(row.userId, value).then(response => {
         Message.success("修改成功，新密码是：" + value);
      });
   }).catch(() => { });
}
/**
 * 选择条数
 */
const handleSelectionChange = (selection) => {
   ids.value = selection.map(item => item.userId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}


/*** 用户导入参数 */
const upload = ref({
   // 是否显示弹出层（用户导入）
   open: false,
   // 弹出层标题（用户导入）
   title: "",
   // 是否禁用上传
   isUploading: false,
   // 是否更新已经存在的用户数据
   updateSupport: 0,
   // 设置上传的请求头部
   headers: { Authorization: "Bearer " + getToken() },
   // 上传的地址
   url: PUBLIC_PATH + "system/user/importData"
})
/**upload ref */
const uploadRef = ref(null);


/**
 * 导入
 */
const handleImport = () => {
   upload.value.title = "用户导入";
   upload.value.open = true;
}
/** 下载模板操作 */
const importTemplate = () => {
   importUserTemplate().then(response => {
      download(response.msg);
   });
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
   upload.value.isUploading = true;
}
// 文件上传成功处理
const handleFileSuccess = (response, file, fileList) => {
   upload.value.open = false;
   upload.value.isUploading = false;
   uploadRef.value.clearFiles();
   MessageBox.alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
   getList();
}
// 提交上传文件
const submitFileForm = () => {
   uploadRef.value.submit();
}

/**用户新增和编辑的数据 */
const operForm = ref({
   // 弹出层标题
   title: "",
   // 部门树选项
   deptOptions: undefined,
   // 是否显示弹出层
   open: false,
   // 部门名称
   deptName: undefined,
   // 默认密码
   initPassword: undefined,
   // 岗位选项
   postOptions: [],
   // 角色选项
   roleOptions: [],
   // 表单参数
   form: {
      userId: undefined,
      deptId: undefined,
      userName: undefined,
      nickName: undefined,
      password: undefined,
      phonenumber: undefined,
      email: undefined,
      sex: undefined,
      status: "0",
      remark: undefined,
      postIds: [],
      roleIds: []
   },
   // 规则
   rules: {
      userName: [
         { required: true, message: "用户名称不能为空", trigger: "blur" },
         { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
      ],
      nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
      password: [
         { required: true, message: "用户密码不能为空", trigger: "blur" },
         { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }],
      email: [{
         type: "email",
         message: "'请输入正确的邮箱地址",
         trigger: ["blur", "change"]
      }],
      phonenumber: [{
         pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
         message: "请输入正确的手机号码",
         trigger: "blur"
      }]
   }
})
/**用户表单的ref */
const operFormRef = ref(null);

/**初始化部门数据 */
const initTreeData = () => {
   // 判断部门的数据是否存在，存在不获取，不存在则获取
   if (operForm.value.deptOptions === undefined) {
      treeselect().then(response => {
         operForm.value.deptOptions = response.data;
      });
   }
}

/**重置操作表单 */
const resetOperForm = () => {
   operForm.value.form = {
      userId: undefined,
      deptId: undefined,
      userName: undefined,
      nickName: undefined,
      password: undefined,
      phonenumber: undefined,
      email: undefined,
      sex: undefined,
      status: "0",
      remark: undefined,
      postIds: [],
      roleIds: []
   };
   nextTick(() => {
      // 重置表单
      if (operFormRef.value) {
         operFormRef.value.resetFields();
      }

   })
}
/**
 * 新增
 */
const handleAdd = () => {   
   resetOperForm();
   initTreeData();
   // 获取用户的岗位,角色等信息
   getUser().then(response => {
      operForm.value.postOptions = response.posts;
      operForm.value.roleOptions = response.roles;
      operForm.value.open = true;
      operForm.value.title = "添加用户";
      operForm.value.form.password = operForm.value.initPassword;
   })
}
/**
 * 修改
 */
const handleUpdate = (row) => {
   resetOperForm();
   initTreeData();
   const userId = row.userId || ids.value;
   // 获取用户的岗位,角色等信息
   getUser(userId).then(response => {
      operForm.value.form = response.data;
      operForm.value.postOptions = response.posts;
      operForm.value.roleOptions = response.roles;
      operForm.value.form.postIds = response.postIds;
      operForm.value.form.roleIds = response.roleIds;
      operForm.value.open = true;
      operForm.value.title = "修改用户";
      operForm.value.form.password = "";
   });
}

/**提交操作表单 */
const submitForm = () => {
   operFormRef.value.validate(valid => {
      if (valid) {
         if (operForm.value.form.userId != undefined) {
            updateUser(operForm.value.form).then(response => {
               Message.success("修改成功");
               operForm.value.open = false;
               getList();
            });
         } else {
            addUser(operForm.value.form).then(response => {
               Message.success("新增成功");
               operForm.value.open = false;
               getList();
            });
         }
      }
   });
}
/**关闭操作表单弹框 */
const cancel = () => {
   operForm.value.open = false;
   resetOperForm();
}
// 初始化部门数据
getTreeselect();
// 下拉框数据
const { sys_normal_disable, sys_user_sex } = useDict('sys_normal_disable', 'sys_user_sex');
// 初始化列表数据
getList();



</script>
<template>
   <div class="app-container">
      <el-row :gutter="20">
         <!--部门数据-->
         <el-col :span="4" :xs="24">
            <div class="head-container">
               <el-input
                  v-model="deptName"
                  placeholder="请输入部门名称"
                  clearable
                  prefix-icon="el-icon-search"
                  style="margin-bottom: 20px"
               />
            </div>
            <div class="head-container">
               <el-tree
                  :data="deptOptions"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  ref="deptTreeRef"
                  default-expand-all
                  @node-click="handleNodeClick"
               />
            </div>
         </el-col>
         <!--用户数据-->
         <el-col :span="20" :xs="24">
            <!-- 条件查询 -->
            <el-form
               :model="queryParams"
               ref="queryFormRef"
               :inline="true"
               v-show="showSearch"
               label-width="68px"
            >
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
               <el-form-item label="状态" prop="status">
                  <el-select
                     v-model="queryParams.status"
                     placeholder="用户状态"
                     clearable
                     style="width: 240px"
                  >
                     <el-option
                        v-for="dict in sys_normal_disable"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                     />
                  </el-select>
               </el-form-item>
               <el-form-item label="创建时间">
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

            <!-- 按钮组 -->
            <el-row :gutter="10" class="mb8">
               <el-col :span="1.5">
                  <el-button
                     type="primary"
                     plain
                     icon="el-icon-plus"
                     @click="handleAdd"
                     v-hasPermi="['system:user:add']"
                  >新增</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="success"
                     plain
                     icon="el-icon-edit"
                     :disabled="single"
                     @click="handleUpdate"
                     v-hasPermi="['system:user:edit']"
                  >修改</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="danger"
                     plain
                     icon="el-icon-delete"
                     :disabled="multiple"
                     @click="handleDelete"
                     v-hasPermi="['system:user:remove']"
                  >删除</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="info"
                     plain
                     icon="el-icon-upload2"
                     @click="handleImport"
                     v-hasPermi="['system:user:import']"
                  >导入</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="warning"
                     plain
                     icon="el-icon-download"
                     @click="handleExport"
                     v-hasPermi="['system:user:export']"
                  >导出</el-button>
               </el-col>
               <right-toolbar
                  :showSearch.sync="showSearch"
                  @queryTable="getList"
                  :columns="columns"
               ></right-toolbar>
            </el-row>
            <!-- 表格 -->
            <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
               <el-table-column type="selection" width="50" align="center" />
               <el-table-column
                  label="用户编号"
                  align="center"
                  key="userId"
                  prop="userId"
                  v-if="columns[0].visible"
               />
               <el-table-column
                  label="用户名称"
                  align="center"
                  key="userName"
                  prop="userName"
                  v-if="columns[1].visible"
                  :show-overflow-tooltip="true"
               />
               <el-table-column
                  label="用户昵称"
                  align="center"
                  key="nickName"
                  prop="nickName"
                  v-if="columns[2].visible"
                  :show-overflow-tooltip="true"
               />
               <el-table-column
                  label="部门"
                  align="center"
                  key="deptName"
                  prop="dept.deptName"
                  v-if="columns[3].visible"
                  :show-overflow-tooltip="true"
               />
               <el-table-column
                  label="手机号码"
                  align="center"
                  key="phonenumber"
                  prop="phonenumber"
                  v-if="columns[4].visible"
                  width="120"
               />
               <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
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
                  label="创建时间"
                  align="center"
                  prop="createTime"
                  v-if="columns[6].visible"
                  width="160"
               >
                  <template #default="scope">
                     <span>{{ parseTime(scope.row.createTime) }}</span>
                  </template>
               </el-table-column>
               <el-table-column
                  label="操作"
                  align="center"
                  width="160"
                  class-name="small-padding fixed-width"
               >
                  <template slot-scope="scope">
                     <el-button
                        v-if="scope.row.userId !== 1"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:user:edit']"
                     >修改</el-button>
                     <el-button
                        v-if="scope.row.userId !== 1"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['system:user:remove']"
                     >删除</el-button>
                     <el-dropdown
                        v-if="scope.row.userId !== 1"
                        @command="(command) => handleCommand(command, scope.row)"
                     >
                        <span
                           class="el-dropdown-link"
                           v-hasPermi="['system:user:resetPwd', 'system:user:edit']"
                        >
                           <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                        </span>
                        <template #dropdown>
                           <el-dropdown-menu>
                              <el-dropdown-item
                                 command="handleResetPwd"
                                 icon="el-icon-key"
                                 v-hasPermi="['system:user:resetPwd']"
                              >重置密码</el-dropdown-item>
                              <el-dropdown-item
                                 command="handleAuthRole"
                                 icon="el-icon-circle-check"
                                 v-hasPermi="['system:user:edit']"
                              >分配角色</el-dropdown-item>
                           </el-dropdown-menu>
                        </template>
                     </el-dropdown>
                  </template>
               </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <pagination
               v-show="total > 0"
               :total="total"
               v-model:page="queryParams.pageNum"
               v-model:limit="queryParams.pageSize"
               @pagination="getList"
            />
         </el-col>
      </el-row>

      <!-- 用户导入对话框 -->
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
         <el-upload
            ref="uploadRef"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="upload.headers"
            :action="upload.url + '?updateSupport=' + upload.updateSupport"
            :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="false"
            drag
         >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
               将文件拖到此处，或
               <em>点击上传</em>
            </div>
            <template #tip>
               <div class="el-upload__tip text-center">
                  <div class="el-upload__tip">
                     <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                  </div>
                  <span>仅允许导入xls、xlsx格式文件。</span>
                  <el-link
                     type="primary"
                     :underline="false"
                     style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate"
                  >下载模板</el-link>
               </div>
            </template>
         </el-upload>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitFileForm">确 定</el-button>
               <el-button @click="upload.open = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="operForm.title" :visible.sync="operForm.open" width="600px" append-to-body>
         <el-form
            :model="operForm.form"
            :rules="operForm.rules"
            ref="operFormRef"
            label-width="80px"
         >
            <el-row>
               <el-col :span="12">
                  <el-form-item label="用户昵称" prop="nickName">
                     <el-input
                        v-model="operForm.form.nickName"
                        placeholder="请输入用户昵称"
                        maxlength="30"
                     />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="归属部门" prop="deptId">
                     <tree-select
                        v-model:value="operForm.form.deptId"
                        :options="operForm.deptOptions"
                        placeholder="请选择归属部门"
                        :objMap="{
                           value: 'id',
                           label: 'label',
                           children: 'children'
                        }"
                     />
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item label="手机号码" prop="phonenumber">
                     <el-input
                        v-model="operForm.form.phonenumber"
                        placeholder="请输入手机号码"
                        maxlength="11"
                     />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="邮箱" prop="email">
                     <el-input v-model="operForm.form.email" placeholder="请输入邮箱" maxlength="50" />
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item
                     v-if="operForm.form.userId == undefined"
                     label="用户名称"
                     prop="userName"
                  >
                     <el-input
                        v-model="operForm.form.userName"
                        placeholder="请输入用户名称"
                        maxlength="30"
                     />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item
                     v-if="operForm.form.userId == undefined"
                     label="用户密码"
                     prop="password"
                  >
                     <el-input
                        v-model="operForm.form.password"
                        placeholder="请输入用户密码"
                        type="password"
                        maxlength="20"
                        show-password
                     />
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item label="用户性别">
                     <el-select v-model="operForm.form.sex" placeholder="请选择">
                        <el-option
                           v-for="dict in sys_user_sex"
                           :key="dict.value"
                           :label="dict.label"
                           :value="dict.value"
                        ></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="状态">
                     <el-radio-group v-model="operForm.form.status">
                        <el-radio
                           v-for="dict in sys_normal_disable"
                           :key="dict.value"
                           :label="dict.value"
                        >{{ dict.label }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="12">
                  <el-form-item label="岗位">
                     <el-select v-model="operForm.form.postIds" multiple placeholder="请选择">
                        <el-option
                           v-for="item in operForm.postOptions"
                           :key="item.postId"
                           :label="item.postName"
                           :value="item.postId"
                           :disabled="item.status == 1"
                        ></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="角色">
                     <el-select v-model="operForm.form.roleIds" multiple placeholder="请选择">
                        <el-option
                           v-for="item in operForm.roleOptions"
                           :key="item.roleId"
                           :label="item.roleName"
                           :value="item.roleId"
                           :disabled="item.status == 1"
                        ></el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
            </el-row>
            <el-row>
               <el-col :span="24">
                  <el-form-item label="备注">
                     <el-input v-model="operForm.form.remark" type="textarea" placeholder="请输入内容"></el-input>
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