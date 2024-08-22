<template>
  <div class="register">
    <div class="register-box">
      <div class="register-box-wrapper">
        <!-- <div ></div> -->
        <div class="register-frame-box">
          <div class="register-frame">
            <div class="register-frame-content">
              <div
                style="
                  color: #2d51e6;
                  display: flex;
                  align-items: baseline;
                  justify-content: center;
                "
              >
                <span style="font-size: 32px; color: #2d51e6; font-weight: 700">欢迎注册</span>
                <img src="" alt="" ref="dragonBoatLogo" style="object-fit: contain; height: 50px" />
              </div>
              <div class="register-frame-input">
                <el-form
                  v-if="isSwitch"
                  ref="lastFormRef"
                  style="max-width: 600px"
                  :model="lastValidateForm"
                  label-width="auto"
                  class="demo-ruleForm"
                  :rules="lastValidateFormRules"
                >
                  <el-form-item label="账号" prop="account">
                    <el-input
                      v-model="lastValidateForm.account"
                      style="width: var(--login-input-width)"
                      placeholder="账号"
                      size="large"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input
                      v-model="lastValidateForm.password"
                      style="width: var(--login-input-width)"
                      placeholder="密码"
                      size="large"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="unit" label="单位">
                    <el-input
                      v-model="lastValidateForm.unit"
                      style="width: var(--login-input-width)"
                      placeholder="单位"
                      size="large"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="phone" label="手机号码">
                    <el-input
                      v-model.number="lastValidateForm.phone"
                      style="width: var(--login-input-width)"
                      placeholder="手机号码"
                      size="large"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="name" label="队伍名称">
                    <el-input
                      v-model="lastValidateForm.name"
                      style="width: var(--login-input-width)"
                      placeholder="队伍名称"
                      size="large"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="intro" label="队伍介绍">
                    <el-input
                      v-model="lastValidateForm.intro"
                      style="width: var(--login-input-width)"
                      placeholder="队伍介绍"
                      size="large"
                      type="textarea"
                    >
                    </el-input>
                  </el-form-item>
                </el-form>
                <!--  -->
                <el-form
                  v-if="!isSwitch"
                  ref="nextFormRef"
                  style="max-width: 600px"
                  :model="emailValidateForm"
                  label-width="auto"
                  class="demo-ruleForm"
                  :rules="nextValidateFormRules"
                >
                  <el-form-item prop="email" label="邮箱">
                    <el-input
                      v-model="emailValidateForm.email"
                      style="width: var(--login-input-width)"
                      placeholder="邮箱"
                      size="large"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="验证码"
                    prop="verify"
                    :rules="[{ required: true, message: '请输入验证码', trigger: 'change' }]"
                  >
                    <div
                      style="
                        display: flex;
                        width: var(--login-input-width);
                        align-items: center;
                        gap: 10px;
                      "
                    >
                      <el-input
                        v-model="emailValidateForm.verify"
                        placeholder="验证码"
                        size="large"
                      >
                        <template #suffix>
                          <el-button
                            type="primary"
                            text
                            style="height: var(--el-component-size-large); width: 100px"
                            @click="sendCodeHandler"
                            :disabled="sendCodeIsDisable"
                          >
                            <span v-if="!sendCodeIsDisable">发送验证码</span>
                            <template # v-if="sendCodeIsDisable">
                              <el-countdown
                                format="已发送ss"
                                :value="value1"
                                @finish="sendCodeIsDisable = !sendCodeIsDisable"
                              />
                            </template>
                          </el-button>
                        </template>
                      </el-input>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <div class="register-frame-btns" v-if="isSwitch">
                <div class="registerBtn btn" @click="next()">
                  <div style="display: flex; align-items: flex-end">
                    <span style="font-size: var(--el-font-size-base); margin-left: 5px"
                      >下一步</span
                    >
                    <el-icon><ArrowRight /></el-icon>
                  </div>
                </div>
              </div>

              <div class="register-frame-btns" v-if="!isSwitch">
                <div
                  class="registerBtn btn"
                  @click="isSwitch = !isSwitch"
                  style="background-color: unset; color: unset"
                >
                  <div style="display: flex; align-items: flex-end">
                    <el-icon><ArrowLeft /></el-icon>
                    <span style="font-size: var(--el-font-size-base); margin-left: 5px"
                      >上一步</span
                    >
                  </div>
                </div>
                <div class="registerBtn btn" @click="submitForm(nextFormRef)">
                  <div style="display: flex; align-items: flex-end">
                    <el-icon><DocumentAdd /></el-icon>
                    <span style="font-size: var(--el-font-size-base); margin-left: 5px">注册</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { DocumentAdd, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import dragonSvg from '@assets/svgs/dragboat_logo.svg'
import type { TeamRegister } from '@/typings/team/index'
import { FormRules, FormInstance, ElMessage } from 'element-plus'
import { AxiosError } from 'axios'
import router from '@/router'
const { $requests, $message } = getCurrentInstance().appContext.config.globalProperties
const isSwitch = ref(true)
const lastFormRef = ref<FormInstance>()
const nextFormRef = ref<FormInstance>()
const lastValidateForm = ref<TeamRegister>({
  name: '',
  account: '',
  intro: '',
  phone: '',
  unit: '',
  password: ''
})
const emailValidateForm = ref({
  email: '',
  verify: ''
})

const lastValidateFormRules = ref<FormRules<TeamRegister>>({
  name: [
    {
      required: true,
      message: '请填写队伍名称',
      trigger: 'change'
    }
  ],
  account: [
    {
      required: true,
      message: '请填写登录账号',
      trigger: 'change'
    }
  ],
  email: [
    { required: true, message: '请填写登录邮箱', trigger: 'change' },
    { type: 'email', message: '邮箱格式错误' }
  ],
  password: [{ required: true, message: '请填写登录密码', trigger: 'change' }],
  phone: [
    { required: true, message: '请填写手机号码', trigger: 'change' },
    { type: 'number', message: '请输入数字' }
  ],
  unit: [{ required: true, message: '请填写单位信息', trigger: 'change' }],
  intro: [{ required: true, message: '请填写队伍介绍', trigger: 'change' }]
})
const nextValidateFormRules = ref<FormRules<TeamRegister>>({
  email: [
    { required: true, message: '请填写登录邮箱', trigger: 'change' },
    { type: 'email', message: '邮箱格式错误' }
  ]
})
const dragonBoatLogo = ref<HTMLImageElement>()
const sendCodeIsDisable = ref(false)
const value1 = ref(Date.now())
// 在你的 setup 方法中
const next = async () => {
  // router.push({
  //   name: 'login'
  // })
  await lastFormRef.value.validate((valid, fields) => {
    if (valid) {
      nextFormRef.value && nextFormRef.value.resetFields()
      isSwitch.value = !isSwitch.value
    } else {
      console.log('error submit!', fields)
    }
  })
}
const sendCodeHandler = () => {
  nextFormRef.value.validate((valid, fields) => {
    console.log(valid, fields)

    if (!fields || !fields.hasOwnProperty('email')) {
      nextFormRef.value.resetFields('verify')
      sendCodeIsDisable.value = !sendCodeIsDisable.value
      value1.value = Date.now() + 1000 * 5
      console.log('submit!')
      $requests.commonAPI
        .getLoginVerifyByEmail(emailValidateForm.value.email)
        .then(({ data: { code, message } }) => {
          if (code != 200) {
            ElMessage({
              type: 'error',
              message
            })
          }
          console.log(message)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      nextFormRef.value.resetFields('verify')
    }
  })
}
const submitForm = async (formEl: FormInstance | undefined) => {
  // router.push({
  //   name: 'login'
  // })
  await formEl.validate((valid, fields) => {
    if (valid) {
      Object.assign(lastValidateForm.value, emailValidateForm.value)
      console.log(lastValidateForm.value)
      $requests.commonAPI
        .registerTeam(lastValidateForm.value)
        .then(({ data: { code, data, message } }) => {
          if (code == 200) {
            $message.success({
              type: 'success',
              message,
              duration: 5000
            })
            router.push('/login')
          } else {
            $message.error({
              type: 'error',
              message,
              duration: 5000
            })
          }
        })
        .catch((err: AxiosError) => {
          $message.error({
            type: 'error',
            message: err.message,
            duration: 5000
          })
          isSwitch.value = !isSwitch.value
          lastFormRef.value && lastFormRef.value.resetFields()
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}
onMounted(() => {
  dragonBoatLogo.value.src = dragonSvg
})
</script>
<style scoped>
:deep(.el-statistic__number) {
  color: var(--el-color-primary);
  font-size: var(--el-font-size-base);
}
.register {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/public/statics/bg-b0a1d9e0.png');
  background-repeat: round;
  .register-box {
    width: 95%;
    height: 95%;
    background-color: #ffffffd9;
    display: flex;
    align-items: center;
    border-radius: 10px;
    .register-box-wrapper {
      width: 100%;
      display: flex;
      .register-frame-box {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        .register-frame {
          border-radius: 10px;
          box-shadow: 2px 3px 7px #0003;
          padding: 10px 40px 35px;
          display: flex;
          align-items: flex-start;
          padding-block-start: 40px;
          .register-frame-content {
            .register-frame-input {
              display: flex;
              flex-direction: column;
              padding-block-start: 45px;
            }
            .btn {
              padding: 12px 19px;
              /* width: 185px; */
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              border-radius: var(--el-border-radius-round);
              border: var(--el-border);
              flex: 1;
            }
            .register-frame-btns {
              display: flex;
              justify-content: space-between;
              gap: var(--login-btn-gap);
              padding-block-start: 20px;
              .registerBtn {
                /* height: 40px; */
              }
              .registerBtn {
                background-color: #4060c7;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
