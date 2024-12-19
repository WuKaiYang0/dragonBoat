<!-- <template>
  <div>
    <el-upload
      ref="avatarUpload"
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :file-list="fileList"
      :limit="2"
      :on-change="onAvatarChange"
      accept="image/jpg,image/png,image/jpeg"
    >
      <i slot="default" class="el-icon-plus"></i>
      <template slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
        </span>
      </template>
      <div slot="tip" class="el-upload__tip">
        只能一个上传jpg/png文件，最后上传的图片会覆盖上一个
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template> -->
<template>
  <el-upload
    ref="upload"
    action="#"
    list-type="picture-card"
    :auto-upload="false"
    :limit="1"
    :on-exceed="handleExceed"
    :on-change="onChange"
  >
    <el-icon><Plus /></el-icon>
    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <el-icon><zoom-in /></el-icon>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
            <el-icon><Download /></el-icon>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
    <template #tip>
      <div class="el-upload__tip text-red" style="color: #f87171 !important">
        提示：限制 1 个文件，新文件将覆盖旧文件
      </div>
    </template>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { genFileId } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
const onChange: UploadProps['onChange'] = (uploadFile: UploadFile) => {
  const rawFile = uploadFile.raw
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    upload.value!.clearFiles()
    return false
  }
  // prop.fileList = []
  // prop.fileList.push(uploadFile)
  return true
}
const upload = ref<UploadInstance>()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
// const prop = defineProps({
//   fileList: {
//     type: Array,
//     required: true
//   }
// })
const handleRemove = (file: UploadFile) => {
  upload.value!.clearFiles()
  console.log(file)
}
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
</script>
<!-- <script>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    fileList: Array
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    /**
     * @param {{raw:File}} file
     */
    onAvatarChange(file, fileList) {
      const isJPG = file.raw.type === 'image/jpeg'
      const isPNG = file.raw.type === 'image/png'
      const isJPEG = file.raw.type === 'image/jpeg'
      const uid = file.raw.uid
      if (!isJPG && !isPNG && !isJPEG) {
        this.$message.error('上传头像图片只能是 JPG/PNG/JPEG 格式!')
        //删除刚加入的
        this.$emit(
          'update:fileList',
          fileList.filter((item) => item.uid !== uid)
        )
      } else {
        this.$emit(
          'update:fileList',
          fileList.filter((item) => item.uid === uid)
        )
        //删除上一个
      }
      // console.log(file.raw, fileList)

      // console.log(URL.createObjectURL(file))
      // this.teamForm.photo = file.raw
      // console.log(this.teamForm.photo)
    },
    teamUrlRemove() {
      this.teamForm.photo = ''
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
})
</script> -->
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
