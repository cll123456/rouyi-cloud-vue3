<script setup>
import { ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import avatar from './../../../../assets/images/profile.jpg'
import 'vue-cropper/dist/index.css'
import { VueCropper } from "vue-cropper";
import { uploadAvatar } from "@/api/system/user";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Upload, Minus, RefreshLeft, RefreshRight } from '@element-plus/icons-vue';

//获取当前组件实例 可获$refs
const { proxy } = getCurrentInstance();
const props = defineProps({
  user: {
    type: Object
  }
})

const store = useStore();


//弹框信息
const dialogInfo = ref({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: "修改头像",
})

//图片裁剪数据
const options = ref({
  img: store.getters.avatar || avatar,
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  isCropper: false,
  previews: {},//预览数据
})
//图片裁剪
const editCropper = () => {
  dialogInfo.value.open = true;
}
/**
 * 实时预览
 * @param data
 */
const realTime = (data) => {
  options.value.previews = data;
}
/**
 * 覆盖默认上传行为
 */
const requestUpload = () => { }
/**
 * 上传预处理
 * @param file
 */
const beforeUpload = (file) => {
  if (!file.type.includes("image/")) {
    this.$modal.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      options.value.img = reader.result;
    };
  }
}
// 向左旋转
const rotateLeft = () => {
  proxy.$refs.cropper.rotateLeft();
}
// 向右旋转
const rotateRight = () => {
  proxy.$refs.cropper.rotateRight();
}
// 图片缩放
const changeScale = (num) => {
  num = num || 1;
  proxy.$refs.cropper.changeScale(num);
}
// 上传图片
const uploadImg = () => {
  proxy.$refs.cropper.getCropBlob(data => {
    let formData = new FormData();
    formData.append("avatarfile", data);
    uploadAvatar(formData).then(response => {
      dialogInfo.value.open = false;
      options.value.img = process.env.VUE_APP_BASE_API + response.imgUrl;
      store.commit('SET_AVATAR', options.value.img);
      ElMessage.success("修改成功");
      options.value.isCropper = false
    });
  });
}
// 打开弹出层结束时的回调
const modalOpened = () => {
  options.value.isCropper = true;
}
// 关闭窗口
const closeDialog = () => {
  options.value.img = store.getters.avatar || avatar
  options.value.isCropper = false;
}
</script>
<template>
  <div class="user-info-head" @click="editCropper()">
    <img :src="options.img" title="点击上传头像" class="img-circle img-lg" />
  </div>
  <el-dialog
    :title="dialogInfo.title"
    v-model="dialogInfo.open"
    width="800px"
    append-to-body
    @opened="modalOpened"
    @close="closeDialog"
  >
    <el-row>
      <el-col :xs="24" :md="12" :style="{ height: '350px' }">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
          v-if="options.isCropper"
        />
      </el-col>
      <el-col :xs="24" :md="12" :style="{ height: '350px' }">
        <div class="avatar-upload-preview">
          <img :src="options.previews.url" :style="options.previews.img" />
        </div>
      </el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :lg="2" :md="2">
        <el-upload
          action="#"
          :http-request="requestUpload"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-button>
            选择
            <i :icon="Upload" class="el-icon--right"></i>
          </el-button>
        </el-upload>
      </el-col>
      <el-col :lg="{ span: 1, offset: 2 }" :md="2">
        <el-button :icon="Plus" @click="changeScale(1)"></el-button>
      </el-col>
      <el-col :lg="{ span: 1, offset: 1 }" :md="2">
        <el-button :icon="Minus" @click="changeScale(-1)"></el-button>
      </el-col>
      <el-col :lg="{ span: 1, offset: 1 }" :md="2">
        <el-button :icon="RefreshLeft" @click="rotateLeft()"></el-button>
      </el-col>
      <el-col :lg="{ span: 1, offset: 1 }" :md="2">
        <el-button :icon="RefreshRight" @click="rotateRight()"></el-button>
      </el-col>
      <el-col :lg="{ span: 2, offset: 6 }" :md="2">
        <el-button type="primary" @click="uploadImg()">提 交</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style lang='scss' scoped>
.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
  content: "+";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 110px;
  border-radius: 50%;
}
</style>