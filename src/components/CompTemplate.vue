<template>
  <div style="margin: 20px auto">
    <el-card class="box-card">
      <div slot="header" style="display: flex; justify-content: end">
        <!-- <span style="align-self: center">龙舟大赛</span> -->
        <el-input v-model="search" size="default" placeholder="赛事名称.." style="width: 30%" />
      </div>
      <!-- <el-table :data="dataFilter()"> -->
      <el-table :data="searchFilter()">
        <el-table-column prop="name" label="赛事名称" />
        <el-table-column prop="startDate" label="开始时间" sortable />
        <el-table-column prop="endDate" label="结束时间" sortable />
        <el-table-column prop="location" label="赛事地点" />
        <el-table-column prop="regulation" label="竞赛规程" />
        <el-table-column prop="deadline" label="报名截止时间" />
        <el-table-column prop="statusVal" label="赛事状态" sortable />
        <el-table-column fixed="right" label="操作" :min-width="allBtnWidth">
          <template #default="comp">
            <!-- 查看按钮 -->
            <el-button v-if="get" type="primary" size="small" @click="matchEvent(1)">
              查看
            </el-button>
            <!-- 下载按钮 -->
            <el-button v-if="download" type="success" size="small" target="_blank">
              <!-- <a :href="VUE_APP_BASE_URL + comp.row.regulation">下载</a> -->
              <a
                target="_blank"
                :href="VUE_APP_BASE_URL + comp.row.regulation"
                style="color: #fff; font-size: 12px; text-decoration: unset"
              >
                下载
              </a>
              <!-- <el-link
                :href="VUE_APP_BASE_URL + comp.row.regulation"
                style="color: #fff; font-size: 12px"
                target="_blank"
                >下载</el-link
              > -->
            </el-button>
            <!-- 编辑按钮 -->
            <el-button
              v-if="edit"
              type="warning"
              size="small"
              @click="formAppearBeforeHandler('更改', comp.row)"
            >
              编辑
            </el-button>
            <!-- 删除按钮 -->
            <el-button v-if="del" size="small" type="danger" @click="deleteCompHandler(2)">
              删除
            </el-button>
          </template>
          <!-- <template slot-scope="scope">
        <slot :comp="scope"></slot>
      </template> -->
        </el-table-column>
      </el-table>
      <el-divider v-if="add" content-position="center">
        <el-button type="text" @click="formAppearBeforeHandler('添加', form)"
          >添加赛事
          <i class="el-icon-circle-plus el-icon--right"></i>
        </el-button>
      </el-divider>
    </el-card>
    <!-- 竞赛项目+裁判组 -->
    <el-dialog width="80%" v-model="outerVisible" title="Tips">
      <!-- 竞赛项目+裁判组 -->
      <SecondMatch
        :com-id="compId"
        :second-com-id.sync="secondComId"
        :inner-visible.sync="innerVisible"
      />
      <el-dialog :visible.sync="innerVisible" width="80%" append-to-body>
        <!-- 竞赛项目详细信息 -->
        <MatchIntroduction :com-id="compId" :second-com-id="secondComId" />
      </el-dialog>
    </el-dialog>
    <!-- 添加/修改赛事 -->
    <el-dialog
      :title="dialogTableStatus + '赛事'"
      :visible.sync="dialogTableVisible"
      :before-close="formDialogCloseBeforeHandler"
    >
      <!-- <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-form"> -->
      <el-form ref="form" :model="form" label-width="120px" class="demo-form">
        <el-form-item label="赛事名称" prop="name">
          <el-input v-model="form.name" placeholder="赛事名称" />
        </el-form-item>
        <el-form-item label="起始时间" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="选择赛事起始日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="选择赛事结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="赛事地点" prop="location">
          <el-input v-model="form.location" placeholder="赛事地点" />
        </el-form-item>
        <el-form-item label="报名截止时间" prop="deadline">
          <el-date-picker
            v-model="form.deadline"
            type="datetime"
            placeholder="报名截止时间"
            format="yyyy 年 MM 月 dd 日 HH 时 mm 分 ss 秒"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="竞赛规程" prop="fileList">
          <el-upload
            class="upload-demo"
            action="#"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            accept="application/pdf"
            :on-change="onChange"
            :file-list="form.fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">tip：只能上传pdf文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitForm"> 立即{{ dialogTableStatus }} </el-button>
    </el-dialog>
  </div>
</template>

<!-- <script lang="ts">
// import api from '@/api'
import SecondMatch from './SecondMatch.vue'
import MatchIntroduction from './MatchIntroduction.vue'
import { AllDataInCompItem } from '@/typings/common'
import { CompItemStatus, SexTypeOnDamand } from '@/typings/enums'
const a = Object.values(SexTypeOnDamand)
console.log(SexTypeOnDamand)

// import ComMixins from '@/mixins/comMixins'
export default {
  name: 'CompTemplate',
  components: { SecondMatch, MatchIntroduction },
  // mixins: [ComMixins],
  props: {
    get: {
      type: Boolean
    },
    del: {
      type: Boolean
    },
    edit: {
      type: Boolean
    },
    download: {
      type: Boolean
    },
    add: {
      type: Boolean
    }
  },
  data() {
    return {
      // search: '',
      innerVisible: false,
      outerVisible: false,
      //传入SecondMatch的compID
      compId: '',
      //传入SecondMatch和MatchIntroduction的secondComId
      secondComId: '',
      VUE_APP_BASE_URL: '',
      dialogTableVisible: false,
      /**@type {'添加'|'更改'}*/
      dialogTableStatus: '添加',
      compInfo: {},
      form: {
        name: '',
        startDate: '',
        endDate: '',
        location: '',
        deadline: '',
        regulation: '',
        fileList: []
      },
      rules: {
        name: [
          { required: true, message: '请输入赛事名称', trigger: 'blur' },
          { min: 3, message: '长度在3个字符以上', trigger: 'blur' }
        ],
        deadline: [
          {
            required: true,
            message: '请选择报名截止日期',
            trigger: 'change'
          }
        ],
        startDate: [
          {
            required: true,
            message: '请选择比赛开始日期',
            trigger: 'change'
          }
        ],
        endDate: [
          {
            required: true,
            message: '请选择比赛结束日期',
            trigger: 'change'
          }
        ],
        location: [
          {
            type: 'string',
            required: true,
            message: '请填写地点',
            trigger: 'blur'
          }
        ],
        fileList: [{ type: 'array', required: true, message: '请上传竞赛规程pdf文件' }]
      },
      basicBtnWidth: 70,
      allBtnWidth: ''
    }
  },
  watch: {
    // $props: {
    //   handler() {
    //     const props = Object.assign({}, this.$props)
    //     //添加赛事不算在操作列中
    //     delete props?.del
    //     let count = 0
    //     Object.values(props).forEach((item) => {
    //       if (item) count = count + 1
    //     })
    //     console.log(count)
    //     this.allBtnWidth = this.basicBtnWidth * count
    //     console.log(this.allBtnWidth)
    //   },
    //   immediate: true
    // }
  },
  created() {
    // this.getComInfo().catch((err) => console.log(err))
  },
  methods: {
    //点击添加赛事、编辑
    // /**
    //  * @param {'添加' | '编辑'} status
    //  * @param {import('@/api/types/user').CompetitionInfoType | undefined} form
    //  */
    formAppearBeforeHandler(status, form) {
      // if (form) {
      //   const fileList = {
      //     fileList: [
      //       {
      //         url: this.VUE_APP_BASE_URL + form.regulation,
      //         name: form.regulation
      //       }
      //     ]
      //   }
      //   Object.assign(this.form, form) //Object.assign赋值不会更改comp.row的值
      // }
      // this.dialogTableStatus = status
      // this.dialogTableVisible = true
    },
    //点击添加赛事、编辑对话框 关闭前
    formDialogCloseBeforeHandler(done) {
      //清除上一个打开的赛事信息，不能赋{}
      // this.form = Object.assign({}, this.$options.data().form)
      // this.$refs.form.resetFields()
      // done()
    },
    //搜索
    dataFilter() {
      return this.allComInfo.filter((data) => !this.search || data.name.includes(this.search))
    },
    // /**
    //  * @param {import('@/api/types/user').CompetitionInfoType} comp
    //  */
    matchEvent(comp) {
      this.compId = comp.id
      this.outerVisible = true
    },
    // /**
    //  * @param {import('@/api/types/user').CompetitionInfoType} comp
    //  */
    async deleteCompHandler(comp) {
      // try {
      //   this.$confirm(`此操作将永久删除"${comp.name}"大赛, 是否继续?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(async () => {
      //     const token = this.$store.getters['user/getToken']
      //     if (token) {
      //       const compID = comp.id
      //       const {
      //         data: { code, message }
      //       } = await api.admin.deleteCompetition(token, compID)
      //       if (code === 200) {
      //         this.$message({
      //           type: 'success',
      //           message
      //         })
      //         this.getComInfo().catch((err) => console.log(err))
      //       } else {
      //         this.$message({
      //           type: 'error',
      //           message
      //         })
      //       }
      //     }
      //   })
      // } catch (error) {
      //   this.$message({
      //     type: 'error',
      //     error
      //   })
      // }
    },
    //点击添加赛事/编辑
    submitForm() {
      // this.$refs.form.validate(async (valid) => {
      //   if (valid) {
      //     try {
      //       const token = this.$store.getters['user/getToken']
      //       if (token) {
      //         const fileList = this.form.fileList
      //         if (fileList.length !== 0 && fileList[0] instanceof File) {
      //           this.form.regulation = fileList[0]
      //         }
      //         let res
      //         if (this.dialogTableStatus === '更改') {
      //           res = api.admin.updateCompetition(token, this.form)
      //         } else if (this.dialogTableStatus === '添加') {
      //           res = api.admin.addCompetition(token, this.form)
      //         }
      //         res.then((a) => {
      //           const {
      //             data: { code, message }
      //           } = a
      //           if (code === 200) {
      //             this.dialogTableVisible = false
      //             this.$message({
      //               type: 'success',
      //               message
      //             })
      //             this.getComInfo().catch((err) => console.log(err))
      //           }
      //         })
      //       }
      //     } catch (error) {
      //       this.$message({
      //         type: 'error',
      //         message: error
      //       })
      //     }
      //   }
      // })
    },
    handleRemove() {
      this.form.fileList.length = 0
    },
    handleExceed(files) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件。`)
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
    // /**
    //  * @param {{raw:File}} file
    //  */
    // onChange(file, fileList) {
    //   if (!file.raw.type.includes('pdf')) {
    //     fileList.length = 0
    //     this.$message.warning(`只能上传pdf文件类型`)
    //   } else {
    //     this.form.fileList.push(file.raw)
    //   }
    // }
  }
}
</script> -->
<script setup lang="ts">
import { AllDataInCompItem } from '@/typings/common'
import { CompItemStatus } from '@/typings/enums'
import { getCurrentInstance, onMounted, ref, watch, defineProps } from 'vue'
const { $requests, $message } = getCurrentInstance().appContext.config.globalProperties
const comps = ref<AllDataInCompItem[]>()
const search = ref('')
const innerVisible = ref(false)
const outerVisible = ref(false)
const compId = ref('')
const secondComId = ref('')
const VUE_APP_BASE_URL = ref(import.meta.env.DB_PROXY_URl)
const dialogTableVisible = ref(false)
const dialogTableStatus = ref('添加')
const compInfo = ref({})
const form = ref({
  name: '',
  startDate: '',
  endDate: '',
  location: '',
  deadline: '',
  regulation: '',
  fileList: []
})
const rules = ref({
  name: [
    { required: true, message: '请输入赛事名称', trigger: 'blur' },
    { min: 3, message: '长度在3个字符以上', trigger: 'blur' }
  ],
  deadline: [
    {
      required: true,
      message: '请选择报名截止日期',
      trigger: 'change'
    }
  ],
  startDate: [
    {
      required: true,
      message: '请选择比赛开始日期',
      trigger: 'change'
    }
  ],
  endDate: [
    {
      required: true,
      message: '请选择比赛结束日期',
      trigger: 'change'
    }
  ],
  location: [
    {
      type: 'string',
      required: true,
      message: '请填写地点',
      trigger: 'blur'
    }
  ],
  fileList: [{ type: 'array', required: true, message: '请上传竞赛规程pdf文件' }]
})
const basicBtnWidth = ref(70)
const allBtnWidth = ref('')
const formAppearBeforeHandler = (status, form1) => {
  if (form1) {
    const fileList = {
      fileList: [
        {
          url: VUE_APP_BASE_URL.value + form1.regulation,
          name: form1.regulation
        }
      ]
    }
    Object.assign(form.value, form1) //Object.assign赋值不会更改comp.row的值
  }
  dialogTableStatus.value = status
  dialogTableVisible.value = true
}
const formDialogCloseBeforeHandler = (done) => {
  //清除上一个打开的赛事信息，不能赋{}
  // form.value = Object.assign({}, this.$options.data().form)
  // this.$refs.form.resetFields()
  // done()
}
const matchEvent = (comp) => {
  compId.value = comp.id
  outerVisible.value = true
}
const deleteCompHandler = (comp) => {
  // try {
  //   this.$confirm(`此操作将永久删除"${comp.name}"大赛, 是否继续?`, '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   }).then(async () => {
  //     const token = this.$store.getters['user/getToken']
  //     if (token) {
  //       const compID = comp.id
  //       const {
  //         data: { code, message }
  //       } = await api.admin.deleteCompetition(token, compID)
  //       if (code === 200) {
  //         this.$message({
  //           type: 'success',
  //           message
  //         })
  //         this.getComInfo().catch((err) => console.log(err))
  //       } else {
  //         this.$message({
  //           type: 'error',
  //           message
  //         })
  //       }
  //     }
  //   })
  // } catch (error) {
  //   this.$message({
  //     type: 'error',
  //     error
  //   })
  // }
}
const submitForm = () => {
  // this.$refs.form.validate(async (valid) => {
  //   if (valid) {
  //     try {
  //       const token = this.$store.getters['user/getToken']
  //       if (token) {
  //         const fileList = this.form.fileList
  //         if (fileList.length !== 0 && fileList[0] instanceof File) {
  //           this.form.regulation = fileList[0]
  //         }
  //         let res
  //         if (this.dialogTableStatus === '更改') {
  //           res = api.admin.updateCompetition(token, this.form)
  //         } else if (this.dialogTableStatus === '添加') {
  //           res = api.admin.addCompetition(token, this.form)
  //         }
  //         res.then((a) => {
  //           const {
  //             data: { code, message }
  //           } = a
  //           if (code === 200) {
  //             this.dialogTableVisible = false
  //             this.$message({
  //               type: 'success',
  //               message
  //             })
  //             this.getComInfo().catch((err) => console.log(err))
  //           }
  //         })
  //       }
  //     } catch (error) {
  //       this.$message({
  //         type: 'error',
  //         message: error
  //       })
  //     }
  //   }
  // })
}
const handleRemove = () => {
  form.value.fileList.length = 0
}
const handleExceed = (files) => {
  $message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件。`)
}
const beforeRemove = (file) => {
  // return $message. .$confirm(`确定移除 ${file.name}？`)
  return false
}
const onChange = (file, fileList) => {
  // if (!file.raw.type.includes('pdf')) {
  //   fileList.length = 0
  //   this.$message.warning(`只能上传pdf文件类型`)
  // } else {
  //   this.form.fileList.push(file.raw)
  // }
}
const props = defineProps({
  get: { type: Boolean },
  del: { type: Boolean },
  edit: { type: Boolean },
  download: { type: Boolean },
  add: { type: Boolean }
})
const searchFilter = () =>
  comps.value?.filter((comp) => !search.value || comp.name.includes(search.value))
watch(comps, (val) => {
  val.forEach((comp) => {
    const status = comp.status
    comp['statusVal'] = CompItemStatus[status]
  })
})
watch(
  props,
  (val) => {
    console.log(val)
  },
  { immediate: true }
)
onMounted(() => {
  $requests.commonAPI
    .postQueryCompetition({
      page: 1,
      row: 20
    })
    .then(({ data: { data } }) => {
      comps.value = data
    })
})
</script>

<style scoped></style>
