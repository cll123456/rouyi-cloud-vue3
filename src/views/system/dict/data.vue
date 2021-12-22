<script>
export default{
   name: 'Data'
}
</script>
<script setup>
import RightToolbar from './../../../components/RightToolbar/index.vue';
import { ref, getCurrentInstance } from '@vue/composition-api';
import Pagination from './../../../components/Pagination/index.vue';
import { Message, MessageBox } from 'element-ui';
import { useDict } from '../../../hooks/dict';
import DictTag from './../../../components/DictTag/index.vue';
import { download, parseTime } from '../../../utils/ruoyi';
import { listType, getType } from '../../../api/system/dict/type';
import { listData, getData, delData, addData, updateData, exportData } from '../../../api/system/dict/data';
 
 const {proxy} = getCurrentInstance();

/**queryFormRef ref */
const queryFormRef = ref(null);

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
// 字典表格数据
const dataList = ref([]);
// 默认字典类型
const defaultDictType = ref("");
// 弹出层标题
const title = ref("");
// 是否显示弹出层
const open = ref(false);
// 数据标签回显样式
const listClassOptions = ref([
   {
      value: "default",
      label: "默认"
   },
   {
      value: "primary",
      label: "主要"
   },
   {
      value: "success",
      label: "成功"
   },
   {
      value: "info",
      label: "信息"
   },
   {
      value: "warning",
      label: "警告"
   },
   {
      value: "danger",
      label: "危险"
   }
]);
// 类型数据字典
const typeOptions = ref([]);
// 查询参数
const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   dictName: undefined,
   dictType: undefined,
   status: undefined
});
// 表单参数
const form = ref({
   dictCode: undefined,
   dictLabel: undefined,
   dictValue: undefined,
   cssClass: undefined,
   listClass: 'default',
   dictSort: 0,
   status: "0",
   remark: undefined
});
// 表单校验
const rules = ref({
   dictLabel: [
      { required: true, message: "数据标签不能为空", trigger: "blur" }
   ],
   dictValue: [
      { required: true, message: "数据键值不能为空", trigger: "blur" }
   ],
   dictSort: [
      { required: true, message: "数据顺序不能为空", trigger: "blur" }
   ]
})

/**form ref */
const formRef = ref(null);

/** 查询字典类型详细 */
const getTypes = (dictId) => {

   getType(dictId).then(response => {
      queryParams.value.dictType = response.data.dictType;
      defaultDictType.value = response.data.dictType;
      getList();
   });
}

/** 查询字典类型列表 */
const getTypeList = () => {
   listType().then(response => {
      typeOptions.value = response.rows;
   });
}
/** 查询字典数据列表 */
const getList = () => {
   loading.value = true;
   listData(queryParams.value).then(response => {
      dataList.value = response.rows;
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
      dictCode: undefined,
      dictLabel: undefined,
      dictValue: undefined,
      cssClass: undefined,
      listClass: 'default',
      dictSort: 0,
      status: "0",
      remark: undefined
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
   queryParams.value.dictType = defaultDictType;
   handleQuery();
}
/** 新增按钮操作 */
const handleAdd = () => {
   reset();
   open.value = true;
   title.value = "添加字典数据";
   form.value.dictType = queryParams.value.dictType;
}
// 多选框选中数据
const handleSelectionChange = (selection) => {
   ids.value = selection.map(item => item.dictCode);
   single.value = selection.length != 1
   multiple.value = !selection.length
}
/** 修改按钮操作 */
const handleUpdate = (row) => {
   reset();
   const dictCode = row.dictCode || ids.value
   getData(dictCode).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改字典数据";
   });
}
/** 提交按钮 */
const submitForm = () => {
   formRef.value.validate(valid => {
      if (valid) {
         if (form.value.dictCode != undefined) {
            updateData(form.value).then(response => {
               Message.success("修改成功");
               open.value = false;
               getList();
            });
         } else {
            addData(form.value).then(response => {
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
   const dictCodes = row.dictCode || ids.value;
   MessageBox.confirm('是否确认删除字典编码为"' + dictCodes + '"的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return delData(dictCodes);
   }).then(() => {
      getList();
      Message.success("删除成功");
   }).catch(() => { });
}
/** 导出按钮操作 */
const handleExport = () => {
   MessageBox.confirm('是否确认导出所有数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
   }).then(function () {
      return exportData(queryParams.value);
   }).then(response => {
      download(response.msg);
   })
}


getTypes(proxy.$route.params && proxy.$route.params.dictId);
getTypeList();
const { sys_normal_disable } = useDict('sys_normal_disable');

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
         <el-form-item label="字典名称" prop="dictType">
            <el-select v-model="queryParams.dictType">
               <el-option
                  v-for="item in typeOptions"
                  :key="item.dictId"
                  :label="item.dictName"
                  :value="item.dictType"
               />
            </el-select>
         </el-form-item>
         <el-form-item label="字典标签" prop="dictLabel">
            <el-input
               v-model="queryParams.dictLabel"
               placeholder="请输入字典标签"
               clearable
               @keyup.enter.native="handleQuery"
            />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="数据状态" clearable>
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
               v-hasPermi="['system:dict:add']"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               icon="el-icon-edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['system:dict:edit']"
            >修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="el-icon-delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:dict:remove']"
            >删除</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="el-icon-download"
               @click="handleExport"
               v-hasPermi="['system:dict:export']"
            >导出</el-button>
         </el-col>
         <right-toolbar  :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="字典编码" align="center" prop="dictCode" />
         <el-table-column label="字典标签" align="center" prop="dictLabel">
            <template #default="scope">
               <span
                  v-if="scope.row.listClass == '' || scope.row.listClass == 'default'"
               >{{ scope.row.dictLabel }}</span>
               <el-tag
                  v-else
                  :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass"
               >{{ scope.row.dictLabel }}</el-tag>
            </template>
         </el-table-column>
         <el-table-column label="字典键值" align="center" prop="dictValue" />
         <el-table-column label="字典排序" align="center" prop="dictSort" />
         <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
               <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
            </template>
         </el-table-column>
         <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
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
                  v-hasPermi="['system:dict:edit']"
               >修改</el-button>
               <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:dict:remove']"
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

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
         <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="字典类型">
               <el-input v-model="form.dictType" :disabled="true" />
            </el-form-item>
            <el-form-item label="数据标签" prop="dictLabel">
               <el-input v-model="form.dictLabel" placeholder="请输入数据标签" />
            </el-form-item>
            <el-form-item label="数据键值" prop="dictValue">
               <el-input v-model="form.dictValue" placeholder="请输入数据键值" />
            </el-form-item>
            <el-form-item label="样式属性" prop="cssClass">
               <el-input v-model="form.cssClass" placeholder="请输入样式属性" />
            </el-form-item>
            <el-form-item label="显示排序" prop="dictSort">
               <el-input-number v-model="form.dictSort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="回显样式" prop="listClass">
               <el-select v-model="form.listClass">
                  <el-option
                     v-for="item in listClassOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
                  ></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
               <el-radio-group v-model="form.status">
                  <el-radio
                     v-for="dict in sys_normal_disable"
                     :key="dict.value"
                     :label="dict.value"
                  >{{ dict.label }}</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
               <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
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