<script setup>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { updateUserProfile } from '../../../../api/system/user';

const props = defineProps({
   user: {
      type: Object
   }
})

const store = useStore();
const router = useRouter();
const route = useRoute();

// 表单校验
const rules = ref({
   nickName: [
      { required: true, message: "用户昵称不能为空", trigger: "blur" }
   ],
   email: [
      { required: true, message: "邮箱地址不能为空", trigger: "blur" },
      {
         type: "email",
         message: "'请输入正确的邮箱地址",
         trigger: ["blur", "change"]
      }
   ],
   phonenumber: [
      { required: true, message: "手机号码不能为空", trigger: "blur" },
      {
         pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
         message: "请输入正确的手机号码",
         trigger: "blur"
      }
   ]
});


const formRef = ref(null);
/**提交 */
const submit = () => {
   formRef.value.validate(valid => {
      if (valid) {
         updateUserProfile(props.user.value).then(response => {
            ElMessage.success("修改成功");
         });
      }
   });
}

/**关闭 */
const close = () => {
   store.dispatch("tagsView/delView", route);
   router.push({ path: "/index" });
}
</script> 
<template>
   <el-form ref="formRef" :model="props.user" :rules="rules" label-width="80px">
      <el-form-item label="用户昵称" prop="nickName">
         <el-input v-model="props.user.nickName" maxlength="30" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
         <el-input v-model="props.user.phonenumber" maxlength="11" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
         <el-input v-model="props.user.email" maxlength="50" />
      </el-form-item>
      <el-form-item label="性别">
         <el-radio-group v-model="props.user.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
         </el-radio-group>
      </el-form-item>
      <el-form-item>
         <el-button type="primary" @click="submit">保存</el-button>
         <el-button type="danger" @click="close">关闭</el-button>
      </el-form-item>
   </el-form>
</template>

<style lang='scss' scoped>
</style>