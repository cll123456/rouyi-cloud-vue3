<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import avatar from './../../../../assets/images/profile.jpg'
const props = defineProps({
   user: {
      type: Object
   }
})

const store = useStore();

const options = ref({
   img: store.getters.avatar || avatar
})

// todo 图片裁剪还没有完成
const editCropper = () => {

}
</script>
<template>
   <div class="user-info-head" @click="editCropper()">
      <img :src="options.img" title="点击上传头像" class="img-circle img-lg" />
   </div>
   <!-- <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @opened="modalOpened"  @close="closeDialog()">
      <el-row>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            @realTime="realTime"
            v-if="visible"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
            <el-button size="small">
              选择
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{span: 1, offset: 2}" :md="2">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :lg="{span: 2, offset: 6}" :md="2">
          <el-button type="primary" size="small" @click="uploadImg()">提 交</el-button>
        </el-col>
      </el-row>
   </el-dialog>-->
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