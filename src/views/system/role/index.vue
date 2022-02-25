<script setup>
import { ref, nextTick } from 'vue';
import { addRole, changeRoleStatus, dataScope, delRole, exportRole, getRole, listRole, updateRole } from '../../../api/system/role';
import { useDict } from '../../../hooks/dict';
import { addDateRange, download, parseTime } from '../../../utils/ruoyi';
import RightToolbar from './../../../components/RightToolbar/index.vue';
import Pagination from './../../../components/Pagination/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { roleMenuTreeselect, treeselect as menuTreeselect } from '../../../api/system/menu';
import { treeselect as deptTreeselect, roleDeptTreeselect } from "../../../api/system/dept";
import { CircleCheck, Delete, Edit, User, DArrowRight, Search, Refresh, Plus, Download } from '@element-plus/icons-vue'


/**queryForm ref */
const queryFormRef = ref(null);

const router = useRouter();
/**查询条件 */
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   roleName: undefined,
   roleKey: undefined,
   status: undefined
})

/** 日期查询条件 */
const dateRange = ref([]);

/**是否显示搜索条件 */
const showSearch = ref(true)
/**表格的loading */
const loading = ref(false);
/**表格数据 */
const roleList = ref([]);
/**总共条数 */
const total = ref(0)


/** 查询角色列表 */
const getList = () => {
   loading.value = true;
   listRole(addDateRange(queryParams.value, dateRange.value)).then(
      response => {
         roleList.value = response.rows;
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
/**重置数据 */
const resetQuery = () => {
   dateRange.value = [];
   queryFormRef.value.resetFields();
   handleQuery();
}

/** 非单个禁用*/
const single = ref(true)
/** 选中多个进行删除*/
const multiple = ref(true);
/**选中删除的id */
const ids = ref([])


/**删除角色 */
const handleDelete = (row) => {
   const roleIds = row.roleId || ids.value;
   ElMessageBox.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delRole(roleIds);
   }).then(() => {
      getList();
      ElMessage.success("删除成功");
   }).catch(() => { });
}
/**导出 */
const handleExport = () => {
   ElMessageBox.confirm('是否确认导出所有角色数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return exportRole(queryParams.value);
   }).then(response => {
      download(response.msg);
   })
}
/**选中checkbook操作 */
const handleSelectionChange = (selection) => {
   ids.value = selection.map(item => item.roleId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
/** 角色状态修改*/
const handleStatusChange = (row) => {
   let text = row.status === "0" ? "启用" : "停用";
   ElMessageBox.confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return changeRoleStatus(row.roleId, row.status);
   }).then(() => {
      ElMessage.success(text + "成功");
   }).catch(function () {
      row.status = row.status === "0" ? "1" : "0";
   });
}

/**更多操作 */
const handleCommand = (command, row) => {
   switch (command) {
      case "handleDataScope":
         handleDataScope(row);
         break;
      case "handleAuthUser":
         handleAuthUser(row);
         break;
      default:
         break;
   }
}

/**分配用户 */
const handleAuthUser = (row) => {
   router.push("/system/role-auth/user/" + row.roleId);
}

// 下拉框数据
const { sys_normal_disable } = useDict('sys_normal_disable');
// 初始化表格数据
getList();

/**新增修改的表单 ref */
const operFormRef = ref(null);
/**打开弹框的标题 */
const title = ref('');

/**表单参数 */
const operForm = ref({
   roleId: undefined,
   roleName: undefined,
   roleKey: undefined,
   dataScope: undefined,
   roleSort: 0,
   status: "0",
   menuIds: [],
   deptIds: [],
   menuCheckStrictly: true,
   deptCheckStrictly: true,
   remark: undefined
})
/**eltree 默认配置 */
const defaultProps = ref({
   children: "children",
   label: "label"
})
/** 表单校验*/
const operFomrRules = ref({
   roleName: [
      { required: true, message: "角色名称不能为空", trigger: "blur" }
   ],
   roleKey: [
      { required: true, message: "权限字符不能为空", trigger: "blur" }
   ],
   roleSort: [
      { required: true, message: "角色顺序不能为空", trigger: "blur" }
   ]
})
/** 分配角色的菜单 */
const menuOptions = ref([]);
/** 菜单ref */
const menuRef = ref(null);
/** 展开还是折叠 */
const menuExpand = ref(false);
/**全选菜单 */
const menuNodeAll = ref(false);
/**是否打开新增或者修改角色 */
const open = ref(false);

/** 部门全部展开 */
const deptExpand = ref(true)
/**部门全选或者非全选 */
const deptNodeAll = ref(false)
/** 数据范围选项*/
const dataScopeOptions = ref([
   {
      value: "1",
      label: "全部数据权限"
   },
   {
      value: "2",
      label: "自定数据权限"
   },
   {
      value: "3",
      label: "本部门数据权限"
   },
   {
      value: "4",
      label: "本部门及以下数据权限"
   },
   {
      value: "5",
      label: "仅本人数据权限"
   }
])
/** 部门列表 */
const deptOptions = ref([]);
/** 部门树的ref */
const deptRef = ref(null);
/** 打开数据权限 */
const openDataScope = ref(false);

/** 查询菜单树结构 */
const getMenuTreeselect = () => {
   menuTreeselect().then(response => {
      menuOptions.value = response.data;
   });
}

/**所有部门节点数据 */
const getDeptAllCheckedKeys = () => {
   // 目前被选中的部门节点
   let checkedKeys = deptRef.value.getCheckedKeys();
   // 半选中的部门节点
   let halfCheckedKeys = deptRef.value.getHalfCheckedKeys();
   checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
   return checkedKeys;
}

/**重置新增的表单以及其他数据  */
const reset = () => {
   if (menuRef.value != undefined) {
      menuRef.value.setCheckedKeys([]);
   }
   menuExpand.value = false,
      menuNodeAll.value = false,
      deptExpand.value = true,
      deptNodeAll.value = false,
      operForm.value = {
         roleId: undefined,
         roleName: undefined,
         roleKey: undefined,
         roleSort: 0,
         status: "0",
         menuIds: [],
         deptIds: [],
         menuCheckStrictly: true,
         deptCheckStrictly: true,
         remark: undefined
      };
   // 表单内容重置
   if (operFormRef.value) {
      operFormRef.value.resetFields();
   }
}

/**添加角色 */
const handleAdd = () => {
   reset();
   getMenuTreeselect();
   open.value = true;
   title.value = "添加角色";
}
/**修改角色 */
const handleUpdate = (row) => {
   reset();
   const roleId = row.roleId || ids.value
   const roleMenu = getRoleMenuTreeselect(roleId);
   getRole(roleId).then(response => {
      operForm.value = response.data;
      operForm.value.roleSort = +operForm.value.roleSort
      open.value = true;
      nextTick(() => {
         roleMenu.then(res => {
            //获取选中的checkedKeys
            let checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
               nextTick(() => {
                  // 设置选中的check
                  menuRef.value.setChecked(v, true, false);
               })
            })
         });
      });
      title.value = "修改角色";
   });
}
/** 根据角色ID查询菜单树结构 */
const getRoleMenuTreeselect = (roleId) => {
   return roleMenuTreeselect(roleId).then(response => {
      menuOptions.value = response.menus;
      return response;
   });
}

/** 根据角色ID查询部门树结构 */
const getRoleDeptTreeselect = (roleId) => {
   return roleDeptTreeselect(roleId).then(response => {
      deptOptions.value = response.depts;
      return response;
   });
}
/**  树权限（展开/折叠）*/
const handleCheckedTreeExpand = (value, type) => {
   if (type == 'menu') {
      let treeList = menuOptions.value;
      for (let i = 0; i < treeList.length; i++) {
         menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
      }
   } else if (type == 'dept') {
      let treeList = deptOptions.value;
      for (let i = 0; i < treeList.length; i++) {
         deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
      }
   }
}
/**树权限（全选/全不选） */
const handleCheckedTreeNodeAll = (value, type) => {
   if (type == 'menu') {
      menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
   } else if (type == 'dept') {
      deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
   }
}
/**树权限（父子联动） */
const handleCheckedTreeConnect = (value, type) => {
   if (type == 'menu') {
      operForm.value.menuCheckStrictly = value ? true : false;
   } else if (type == 'dept') {
      operForm.value.deptCheckStrictly = value ? true : false;
   }
}
/**所有菜单节点数据 */
const getMenuAllCheckedKeys = () => {
   // 目前被选中的菜单节点
   let checkedKeys = menuRef.value.getCheckedKeys();
   // 半选中的菜单节点
   let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
   checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
   return checkedKeys;
}
/** 提交按钮 */
const submitForm = function () {
   operFormRef.value.validate(valid => {
      if (valid) {
         if (operForm.value.roleId != undefined) {
            operForm.value.menuIds = getMenuAllCheckedKeys();
            updateRole(operForm.value).then(response => {
               ElMessage.success("修改成功");
               open.value = false;
               getList();
            });
         } else {
            operForm.value.menuIds = getMenuAllCheckedKeys();
            addRole(operForm.value).then(response => {
               ElMessage.success("新增成功");
               open.value = false;
               getList();
            });
         }
      }
   });
}

/** 取消按钮*/
const cancel = () => {
   open.value = false;
   reset();
}

/** 选择角色权限范围触发 */
const dataScopeSelectChange = (value) => {
   if (value !== '2') {
      deptRef.value.setCheckedKeys([]);
   }
}

/**数据权限 */
const handleDataScope = (row) => {
   reset();
   const roleDeptTreeselect = getRoleDeptTreeselect(row.roleId);
   getRole(row.roleId).then(response => {
      operForm.value = response.data;
      openDataScope.value = true;
      nextTick(() => {
         roleDeptTreeselect.then(res => {
            nextTick(() => {
               if (deptRef.value) {
                  deptRef.value.setCheckedKeys(res.checkedKeys);
               }
            })
         });
      });
      title.value = "分配数据权限";
   });
}

/** 提交按钮（数据权限） */
const submitDataScope = () => {
   if (operForm.value.roleId != undefined) {
      operForm.value.deptIds = getDeptAllCheckedKeys();
      dataScope(operForm.value).then(response => {
         ElMessage.success("修改成功");
         openDataScope.value = false;
         getList();
      });
   }
}

/** 取消按钮（数据权限）*/
const cancelDataScope = () => {
   openDataScope.value = false;
   reset();
}

</script>
<template>
   <div class="app-container">
      <!-- 查询条件 -->
      <el-form :model="queryParams" ref="queryFormRef" v-show="showSearch" :inline="true">
         <el-form-item label="角色名称" prop="roleName">
            <el-input
               v-model="queryParams.roleName"
               placeholder="请输入角色名称"
               clearable
               style="width: 240px"
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="权限字符" prop="roleKey">
            <el-input
               v-model="queryParams.roleKey"
               placeholder="请输入权限字符"
               clearable
               style="width: 240px"
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select
               v-model="queryParams.status"
               placeholder="角色状态"
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
      <!-- 按钮组 -->
      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="primary"
               plain
               :icon="Plus"
               @click="handleAdd"
               v-hasPermi="['system:role:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               :icon="Edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['system:role:edit']"
            >修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               :icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:role:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               :icon="Download"
               @click="handleExport"
               v-hasPermi="['system:role:export']"
            >导出</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <!-- 表格数据 -->
      <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="角色编号" prop="roleId" width="120" />
         <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true"  />
         <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true"  />
         <el-table-column label="显示顺序" prop="roleSort"  />
         <el-table-column label="状态" align="center" >
            <template #default="scope">
               <el-switch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
               ></el-switch>
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column
            label="操作"
            width="200"
            align="center"
            class-name="small-padding fixed-width"
         >
            <template #default="scope">
               <el-button
                  v-if="scope.row.roleId !== 1"
                  type="text"
                  :icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:role:edit']"
               >修改</el-button>
               <el-button
                  v-if="scope.row.roleId !== 1"
                  type="text"
                  :icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:role:remove']"
               >删除</el-button>
               <el-dropdown
                  v-if="scope.row.roleId !== 1"
                  @command="(command) => handleCommand(command, scope.row)"
               >
                  <el-button
                     type="text"
                     class="el-dropdown-link"
                     :icon="DArrowRight"
                     v-hasPermi="['system:role:edit']"
                  >更多</el-button>
                  <template #dropdown>
                     <el-dropdown-menu>
                        <el-dropdown-item command="handleDataScope">
                           <span v-hasPermi="['system:role:edit']">
                              <el-icon>
                                 <circle-check></circle-check>
                              </el-icon>数据权限
                           </span>
                        </el-dropdown-item>
                        <el-dropdown-item command="handleAuthUser">
                           <span v-hasPermi="['system:role:edit']">
                              <el-icon>
                                 <user></user>
                              </el-icon>分配用户
                           </span>
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

      <!-- 添加或修改角色配置对话框 -->
      <el-dialog :title="title" v-model="open" width="500px" append-to-body>
         <el-form ref="operFormRef" :model="operForm" :rules="operFomrRules" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
               <el-input v-model="operForm.roleName" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item prop="roleKey">
               <template #label>
                  <span>
                     <el-tooltip
                        content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
                        placement="top"
                     >
                        <i class="el-icon-question"></i>
                     </el-tooltip>权限字符
                  </span>
               </template>
               <el-input v-model="operForm.roleKey" placeholder="请输入权限字符" />
            </el-form-item>
            <el-form-item label="角色顺序" prop="roleSort">
               <el-input-number v-model="operForm.roleSort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="状态">
               <el-radio-group v-model="operForm.status">
                  <el-radio
                     v-for="dict in sys_normal_disable"
                     :key="dict.value"
                     :label="dict.value"
                  >{{ dict.label }}</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单权限">
               <el-checkbox
                  v-model="menuExpand"
                  @change="handleCheckedTreeExpand($event, 'menu')"
               >展开/折叠</el-checkbox>
               <el-checkbox
                  v-model="menuNodeAll"
                  @change="handleCheckedTreeNodeAll($event, 'menu')"
               >全选/全不选</el-checkbox>
               <el-checkbox
                  v-model="operForm.menuCheckStrictly"
                  @change="handleCheckedTreeConnect($event, 'menu')"
               >父子联动</el-checkbox>
               <div style="width: 100%;">
                  <el-tree
                     class="tree-border"
                     :data="menuOptions"
                     show-checkbox
                     ref="menuRef"
                     node-key="id"
                     :check-strictly="!operForm.menuCheckStrictly"
                     empty-text="加载中，请稍后"
                     :props="defaultProps"
                  ></el-tree>
               </div>
            </el-form-item>
            <el-form-item label="备注">
               <el-input v-model="operForm.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>

      <!-- 分配角色数据权限对话框 -->
      <el-dialog :title="title" v-model="openDataScope" width="500px" append-to-body>
         <el-form :model="operForm" label-width="80px">
            <el-form-item label="角色名称">
               <el-input v-model="operForm.roleName" :disabled="true" />
            </el-form-item>
            <el-form-item label="权限字符">
               <el-input v-model="operForm.roleKey" :disabled="true" />
            </el-form-item>
            <el-form-item label="权限范围">
               <el-select v-model="operForm.dataScope" @change="dataScopeSelectChange">
                  <el-option
                     v-for="item in dataScopeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
                  ></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="数据权限" v-show="operForm.dataScope == 2">
               <el-checkbox
                  v-model="deptExpand"
                  @change="handleCheckedTreeExpand($event, 'dept')"
               >展开/折叠</el-checkbox>
               <el-checkbox
                  v-model="deptNodeAll"
                  @change="handleCheckedTreeNodeAll($event, 'dept')"
               >全选/全不选</el-checkbox>
               <el-checkbox
                  v-model="operForm.deptCheckStrictly"
                  @change="handleCheckedTreeConnect($event, 'dept')"
               >父子联动</el-checkbox>
               <div style="width: 100%;">
                  <el-tree
                     class="tree-border"
                     :data="deptOptions"
                     show-checkbox
                     default-expand-all
                     ref="deptRef"
                     node-key="id"
                     :check-strictly="!operForm.deptCheckStrictly"
                     empty-text="加载中，请稍后"
                     :props="defaultProps"
                  ></el-tree>
               </div>
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitDataScope">确 定</el-button>
               <el-button @click="cancelDataScope">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<style lang='scss' scoped>
</style>