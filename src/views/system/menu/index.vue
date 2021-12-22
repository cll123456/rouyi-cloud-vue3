
<script>
export default{
   name: 'Menu'
}
</script>
<script setup>
import { ref, nextTick } from '@vue/composition-api';
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { Message, MessageBox } from 'element-ui';
import { useDict } from '../../../hooks/dict';
import { handleTree, parseTime } from '../../../utils/ruoyi';
import { addMenu, delMenu, getMenu, listMenu, updateMenu } from '../../../api/system/menu';
import SvgIcon from './../../../components/SvgIcon/index.vue';
import TreeSelect from './../../../components/TreeSelect/index.vue'
import IconSelect from './../../../components/IconSelect/index.vue';
import DictTag from './../../../components/DictTag/index.vue';

const queryFormRef = ref(null);

// 遮罩层
const loading = ref(true);
// 显示搜索条件
const showSearch = ref(true);
// 菜单表格树数据
const menuList = ref([]);
// 菜单树选项
const menuOptions = ref([]);
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
// 是否展开，默认全部折叠
const isExpandAll = ref(false);
// 重新渲染表格状态
const refreshTable = ref(true);
// 查询参数
const queryParams = ref({
   menuName: undefined,
   visible: undefined
});
// 表单参数
const form = ref({
   menuId: undefined,
   parentId: 0,
   menuName: undefined,
   icon: undefined,
   menuType: "M",
   orderNum: undefined,
   isFrame: "1",
   isCache: "0",
   visible: "0",
   status: "0"
});
// 表单校验
const rules = ref({
   menuName: [
      { required: true, message: "菜单名称不能为空", trigger: "blur" }
   ],
   orderNum: [
      { required: true, message: "菜单顺序不能为空", trigger: "blur" }
   ],
   path: [
      { required: true, message: "路由地址不能为空", trigger: "blur" }
   ]
});
/** form ref */
const formRef = ref(null);


/** 查询菜单列表 */
const getList = () => {
   loading.value = true;
   listMenu(queryParams.value).then(response => {
      menuList.value = handleTree(response.data, "menuId");
      loading.value = false;
   });
}
/** 查询菜单下拉树结构 */
const getTreeselect = async () => {
   menuOptions.value = []
   await listMenu().then(response => {
      const menu = { menuId: 0, menuName: '主类目', children: [] };
      menu.children = handleTree(response.data, "menuId");
      menuOptions.value.push(menu);
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
      menuId: undefined,
      parentId: 0,
      menuName: undefined,
      icon: undefined,
      menuType: "M",
      orderNum: undefined,
      isFrame: "1",
      isCache: "0",
      visible: "0",
      status: "0"
   };
   if (formRef.value) {
      formRef.value.resetFields();
   }
}

/**是否展示选择图片 */
const showChooseIcon = ref(false);
const iconSelectRef = ref(null);
/**展示下拉icon */
const showSelectIcon = () => {
   iconSelectRef.value.reset();
   showChooseIcon.value = true;
}
// 选择图标
const selected = (name) => {
   form.value.icon = name;
   showChooseIcon.value = false;
}
/** 搜索按钮操作 */
const handleQuery = () => {
   getList();
}
/** 重置按钮操作 */
const resetQuery = () => {
   queryFormRef.value.resetFields();
   handleQuery();
}
/** 新增按钮操作 */
const handleAdd = async (row) => {
   reset();
   await getTreeselect();
   if (row != null && row.menuId) {
      form.value.parentId = row.menuId;
   } else {
      form.value.parentId = 0;
   }
   open.value = true;
   title.value = "添加菜单";
}
/** 展开/折叠操作 */
const toggleExpandAll = () => {
   refreshTable.value = false;
   isExpandAll.value = !isExpandAll.value;
   nextTick(() => {
      refreshTable.value = true;
   });
}
/** 修改按钮操作 */
const handleUpdate = async (row) => {
   reset();
   await getTreeselect();
   getMenu(row.menuId).then(response => {
      form.value = response.data;
      form.value.orderNum = Number(form.value.orderNum);
      open.value = true;
      title.value = "修改菜单";
   });

}
/** 提交按钮 */
const submitForm = () => {
   formRef.value.validate(valid => {
      if (valid) {
         if (form.value.menuId != undefined) {
            updateMenu(form.value).then(response => {
               Message.success("修改成功");
               open.value = false;
               getList();
            });
         } else {
            addMenu(form.value).then(response => {
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
   MessageBox.confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delMenu(row.menuId);
   }).then(() => {
      getList();
      Message.success("删除成功");
   }).catch(() => { });
}

const { sys_show_hide, sys_normal_disable } = useDict('sys_show_hide', 'sys_normal_disable');

getList();
</script>
<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" v-show="showSearch">
         <el-form-item label="菜单名称" prop="menuName">
            <el-input
               v-model="queryParams.menuName"
               placeholder="请输入菜单名称"
               clearable
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
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
               v-hasPermi="['system:menu:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="info" plain icon="el-icon-sort" @click="toggleExpandAll">展开/折叠</el-button>
         </el-col>
         <right-toolbar  :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table
         v-if="refreshTable"
         v-loading="loading"
         :data="menuList"
         row-key="menuId"
         :default-expand-all="isExpandAll"
         :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
         <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
         <el-table-column prop="icon" label="图标" align="center" width="100">
            <template #default="scope">
               <svg-icon :icon-class="scope.row.icon" />
            </template>
         </el-table-column>
         <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
         <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
               <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" prop="createTime">
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
                  v-hasPermi="['system:menu:edit']"
               >修改</el-button>
               <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="handleAdd(scope.row)"
                  v-hasPermi="['system:menu:add']"
               >新增</el-button>
               <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:menu:remove']"
               >删除</el-button>
            </template>
         </el-table-column>
      </el-table>

      <!-- 添加或修改菜单对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
         <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-row>
               <el-col :span="24">
                  <el-form-item label="上级菜单">
                     <tree-select
                        v-model:value="form.parentId"
                        :options="menuOptions"
                        :objMap="{
                           value: 'menuId',
                           label: 'menuName',
                           children: 'children'
                        }"
                        placeholder="选择上级菜单"
                     />
                  </el-form-item>
               </el-col>
               <el-col :span="24">
                  <el-form-item label="菜单类型" prop="menuType">
                     <el-radio-group v-model="form.menuType">
                        <el-radio label="M">目录</el-radio>
                        <el-radio label="C">菜单</el-radio>
                        <el-radio label="F">按钮</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="24" v-if="form.menuType != 'F'">
                  <el-form-item label="菜单图标">
                     <el-popover
                        placement="bottom-start"
                        :width="540"
                        v-model:visible="showChooseIcon"
                        trigger="click"
                        @show="showSelectIcon"
                     >
                        <icon-select ref="iconSelectRef" @selected="selected" />
                        <template #reference>
                           <el-input v-model="form.icon" placeholder="点击选择图标" readonly>
                              <template #prefix>
                                 <svg-icon
                                    v-if="form.icon"
                                    :icon-class="form.icon"
                                    class="el-input__icon"
                                    style="height: 32px;width: 16px;"
                                 />
                                 <i v-else class="el-icon-search el-input__icon" />
                              </template>
                           </el-input>
                        </template>
                     </el-popover>
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="菜单名称" prop="menuName">
                     <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
                  </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="显示排序" prop="orderNum">
                     <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType != 'F'">
                  <el-form-item>
                     <template #label>
                        <span>
                           <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                              <i class="el-icon-question"></i>
                           </el-tooltip>是否外链
                        </span>
                     </template>
                     <el-radio-group v-model="form.isFrame">
                        <el-radio label="0">是</el-radio>
                        <el-radio label="1">否</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType != 'F'">
                  <el-form-item prop="path">
                     <template #label>
                        <span>
                           <el-tooltip
                              content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                              placement="top"
                           >
                              <i class="el-icon-question"></i>
                           </el-tooltip>路由地址
                        </span>
                     </template>
                     <el-input v-model="form.path" placeholder="请输入路由地址" />
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType == 'C'">
                  <el-form-item prop="component">
                     <template #label>
                        <span>
                           <el-tooltip
                              content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                              placement="top"
                           >
                              <i class="el-icon-question"></i>
                           </el-tooltip>组件路径
                        </span>
                     </template>
                     <el-input v-model="form.component" placeholder="请输入组件路径" />
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType != 'M'">
                  <el-form-item>
                     <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
                     <template #label>
                        <span>
                           <el-tooltip
                              content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                              placement="top"
                           >
                              <i class="el-icon-question"></i>
                           </el-tooltip>权限字符
                        </span>
                     </template>
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType == 'C'">
                  <el-form-item>
                     <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
                     <template #label>
                        <span>
                           <el-tooltip content="访问路由的默认传递参数，如：`{id: 1, name: ry}`" placement="top">
                              <i class="el-icon-question"></i>
                           </el-tooltip>路由参数
                        </span>
                     </template>
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType == 'C'">
                  <el-form-item>
                     <template #label>
                        <span>
                           <el-tooltip
                              content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                              placement="top"
                           >
                              <i class="el-icon-question"></i>
                           </el-tooltip>是否缓存
                        </span>
                     </template>
                     <el-radio-group v-model="form.isCache">
                        <el-radio label="0">缓存</el-radio>
                        <el-radio label="1">不缓存</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType != 'F'">
                  <el-form-item>
                     <template #label>
                        <span>
                           <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                              <i class="el-icon-question"></i>
                           </el-tooltip>显示状态
                        </span>
                     </template>
                     <el-radio-group v-model="form.visible">
                        <el-radio
                           v-for="dict in sys_show_hide"
                           :key="dict.value"
                           :label="dict.value"
                        >{{ dict.label }}</el-radio>
                     </el-radio-group>
                  </el-form-item>
               </el-col>
               <el-col :span="12" v-if="form.menuType != 'F'">
                  <el-form-item>
                     <template #label>
                        <span>
                           <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                              <i class="el-icon-question"></i>
                           </el-tooltip>菜单状态
                        </span>
                     </template>
                     <el-radio-group v-model="form.status">
                        <el-radio
                           v-for="dict in sys_normal_disable"
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
   </div>
</template>

<style lang='scss' scoped>
</style>