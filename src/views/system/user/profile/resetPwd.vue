<script setup>
import { Message } from 'element-ui'
import { ref } from '@vue/composition-api';
 
 
import { updateUserPwd } from '../../../../api/system/user';
/**用户数据 */
const user = ref({
   oldPassword: undefined,
   newPassword: undefined,
   confirmPassword: undefined
})
import store from '@/store'
import router from '@/router';
const route = router.currentRoute;

/**比较两次密码是否一致 */
const equalToPassword = (rule, value, callback) => {
   if (user.value.newPassword !== value) {
      callback(new Error("两次输入的密码不一致"));
   } else {
      callback();
   }
}
/** 表单校验*/
const rules = ref({
   oldPassword: [
      { required: true, message: "旧密码不能为空", trigger: "blur" }
   ],
   newPassword: [
      { required: true, message: "新密码不能为空", trigger: "blur" },
      { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
   ],
   confirmPassword: [
      { required: true, message: "确认密码不能为空", trigger: "blur" },
      { required: true, validator: equalToPassword, trigger: "blur" }
   ]
})

/**form ref */
const formRef = ref(null)

const submit = () => {
   formRef.value.validate(valid => {
      if (valid) {
         updateUserPwd(user.value.oldPassword, user.value.newPassword).then(
            response => {
               Message.success("修改成功");
            }
         );
      }
   });
}
/**
 * 关闭
 */
const close = () => {
   store.dispatch("tagsView/delView", route);
   router.push({ path: "/index" });
}
</script>
<template>
   <el-form ref="formRef" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
         <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
         <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
         <el-input
            v-model="user.confirmPassword"
            placeholder="请确认密码"
            type="password"
            show-password
         />
      </el-form-item>
      <el-form-item>
         <el-button type="primary" @click="submit">保存</el-button>
         <el-button type="danger" @click="close">关闭</el-button>
      </el-form-item>
   </el-form>
</template>

<style lang='scss' scoped>
</style>