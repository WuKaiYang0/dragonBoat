<template>
  <div class="login">
    <div class="login-box">
      <div class="login-box-wrapper">
        <div class="login-box-image">
          <span class="image-text text-main">龙舟管理系统</span>
          <span class="image-text text-sub">Dragon Boat Management System</span>
          <img src="/public/statics/login-d579ccd3.png" alt="" class="login-box-img" />
        </div>
        <div class="login-frame-box" style="perspective: 100vh">
          <div login-frame ref="animationRef">
            <div class="login-frame-content">
              <div
                style="
                  color: #2d51e6;
                  display: flex;
                  align-items: baseline;
                  justify-content: center;
                "
                @click="submitForm(loginMode)"
              >
                <span style="font-size: 32px; color: #2d51e6; font-weight: 700"
                  >{{ loginMode }}登录</span
                >
                <img src="" alt="" ref="dragonBoatLogo" style="object-fit: contain; height: 50px" />
              </div>
              <div class="login-frame-input">
                <el-form
                  v-if="loginMode === '邮箱'"
                  ref="emailFormRef"
                  style="max-width: 600px"
                  :model="emailForm"
                  label-width="auto"
                  class="demo-ruleForm"
                >
                  <el-form-item
                    prop="email"
                    :rules="[
                      { required: true, message: `请输入邮箱`, trigger: 'change' },
                      { type: 'email', message: `邮箱格式不正确`, trigger: 'change' }
                    ]"
                  >
                    <el-input
                      v-model="emailForm.email"
                      style="width: var(--login-input-width)"
                      placeholder="邮箱"
                      :prefix-icon="User"
                      size="large"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
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
                        v-model="emailForm.verify"
                        placeholder="验证码"
                        :prefix-icon="Key"
                        size="large"
                      >
                      </el-input>
                      <el-button
                        type="info"
                        plain
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
                    </div>
                  </el-form-item>
                </el-form>
                <el-form
                  v-else
                  ref="accountFormRef"
                  style="max-width: 600px"
                  :model="accountForm"
                  label-width="auto"
                  class="demo-ruleForm"
                >
                  <el-form-item
                    prop="account"
                    :rules="[{ required: true, message: `请输入账号`, trigger: 'change' }]"
                  >
                    <el-input
                      v-model="accountForm.account"
                      style="width: var(--login-input-width)"
                      placeholder="账号或者邮箱"
                      :prefix-icon="User"
                      size="large"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    prop="password"
                    :rules="[{ required: true, message: '请输入密码', trigger: 'change' }]"
                  >
                    <el-input
                      v-model="accountForm.password"
                      style="width: var(--login-input-width)"
                      placeholder="密码"
                      :prefix-icon="Lock"
                      show-password
                      size="large"
                    >
                    </el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="login-frame-btns">
                <div class="registerBtn btn" @click="router.push('/register')">
                  <el-icon><DocumentAdd /></el-icon>
                  <span style="font-size: var(--el-font-size-base); margin-left: 5px">注册</span>
                </div>
                <div class="loginBtn btn" @click="submitForm(loginMode)">
                  <el-icon><UserFilled /></el-icon>
                  <span style="font-size: var(--el-font-size-base); margin-left: 5px">登录</span>
                </div>
              </div>
              <el-divider content-position="center"
                >换个登录方式？<span
                  style="color: #2d51e6; cursor: pointer; font-weight: 700"
                  @click="switchLoginMode"
                  >{{ loginMode === '账号' ? '邮箱' : '账号' }}</span
                ></el-divider
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, DocumentAdd, UserFilled, Key } from '@element-plus/icons-vue'
import dragonSvg from '@assets/svgs/dragboat_logo.svg'
import { ElMessage, FormInstance } from 'element-plus'
import { BackDataFormat } from '@/typings/common/index'
import { AxiosError, AxiosResponse } from 'axios'
import { getItem, setItem } from '@/utils/localStorage'
import { LocalStorageKey } from '@/typings/enums'
import { useUserStore } from '@/stores/user'
const value1 = ref(Date.now())
const accountForm = ref({ account: '', password: '' })
const emailForm = ref({ email: '', verify: '' })
const dragonBoatLogo = ref<HTMLImageElement>()
const router = useRouter()
const emailFormRef = ref<FormInstance>()
const accountFormRef = ref<FormInstance>()
const animationRef = ref<HTMLElement>()
const sendCodeIsDisable = ref(false)
type LoginMode = '邮箱' | '账号'
let loginMode = ref<LoginMode>('账号')
const store = useUserStore()
const c = {
  邮箱: {
    class1: 'clockwise90',
    class2: 'clockwise360'
  },
  账号: {
    class1: 'anticlockwise90',
    class2: 'anticlockwise360'
  }
}
const addAnimation = (fn: () => void) => animationRef.value.addEventListener('animationend', fn)
const switchLoginMode = () => {
  const node = animationRef.value
  const class1 = c[loginMode.value].class1
  const class2 = c[loginMode.value].class2
  const lastClassName = !node.className.split(' ')[0] ? [] : node.className.split(' ')
  if (lastClassName.length > 0) {
    node.classList.remove(...node.className.split(' '))
  }
  node.classList.add(class1)
  addAnimation(function first() {
    node.classList.remove(class1)
    node.offsetHeight
    node.classList.add(class2)
    if (loginMode.value === '账号') {
      loginMode.value = '邮箱'
    } else {
      loginMode.value = '账号'
    }
    node.removeEventListener('animationend', first)
    addAnimation(function second() {
      node.removeEventListener('animationend', second)
    })
  })
}
const submitForm = async (mode: LoginMode) => {
  try {
    const formEl: FormInstance = mode === '账号' ? accountFormRef.value : emailFormRef.value
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        let res: AxiosResponse<BackDataFormat<{ token: string }>>
        if (mode === '邮箱') {
          res = await $requests.commonAPI.postLoginByEmail(emailForm.value)
        } else {
          res = await $requests.commonAPI.postLoginByAccount(accountForm.value)
        }
        const {
          data: { code, message, data }
        } = res
        if (code == 200) {
          $message.success({
            message: '登录成功'
          })
          setItem(LocalStorageKey.TOKEN, data.token)
          useUserStore().setToken(data.token)
          router.push('/home')
          // $requests.teamAPI
          //   .getTeamInfo(getItem(LocalStorageKey.TOKEN))
          //   .then(({ data: { code, data, message } }) => {
          //     if (code == 200) {
          //       store.setUserInfo(data)
          //       router.push('/home')
          //     } else {
          //       $message.error({
          //         message
          //       })
          //     }
          //   })
          //   .catch((rej: AxiosError) => {
          //     $message.error({
          //       message: rej.message
          //     })
          //   })
        } else {
          $message.error({
            message: `${mode}或密码错误`,
            plain: true
          })
        }
        console.log('submit!')
      } else {
        console.log('error submit!', fields)
      }
    })
  } catch (error) {
    ElMessage({
      type: 'error'
    })
  }
}
// import { getLoginCodeByEmail, postLoginByAccount, postLoginByEmail } from '@http/index'
const { $requests, $message } = getCurrentInstance().appContext.config.globalProperties
// getLoginCode('1272610480@qq.com').then((res) => console.log(res))
const sendCodeHandler = () => {
  emailFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      sendCodeIsDisable.value = !sendCodeIsDisable.value
      value1.value = Date.now() + 1000 * 5
      console.log('submit!')
      const res = await $requests.commonAPI.getLoginVerifyByEmail(emailForm.value.email)
      console.log(res.data.message)
    } else {
      console.log('error submit!', fields)
    }
  })
}
onMounted(() => {
  dragonBoatLogo.value.src = dragonSvg
  const token = getItem(LocalStorageKey.TOKEN) || store.token
  if (token) {
    // $requests.teamAPI
    //   .getTeamInfo(token)
    //   .then(({ data: { code, data, message } }) => {
    //     if (code == 200) {
    //       store.setUserInfo(data)
    //       router.push('/home')
    //     } else {
    //       $message.error({
    //         message
    //       })
    //     }
    //   })
    //   .catch((rej: AxiosError) => {
    //     $message.error({
    //       message: rej.message
    //     })
    //   })
  }
})
</script>
<style scoped>
:deep(.el-statistic__number) {
  color: var(--el-color-info);
  font-size: var(--el-font-size-base);
}

.login {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/public/statics/bg-b0a1d9e0.png');
  background-repeat: round;
  .login-box {
    width: 95%;
    height: 95%;
    background-color: #ffffffd9;
    display: flex;
    align-items: center;
    border-radius: 10px;
    .login-box-wrapper {
      width: 100%;
      display: flex;
      /* justify-content: center; */
      .login-box-image {
        /* flex: 1; */
        .image-text {
          display: block;
          padding-left: 40px;
          text-align: left;
        }
        .text-main {
          color: #2f394e;
          font-weight: 400;
          font-size: 48px;
        }
        .text-sub {
          color: #6e736f;
        }
        .login-box-img {
          object-fit: contain;
        }
      }
      .login-frame-box {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        [login-frame] {
          transition: 2s;
          border-radius: 10px;
          box-shadow: 2px 3px 7px #0003;
          padding: 10px 40px 35px;
          display: flex;
          align-items: flex-start;
          padding-block-start: 40px;
          backface-visibility: hidden;
          .login-frame-content {
            .login-frame-input {
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
            .login-frame-btns {
              display: flex;
              justify-content: space-between;
              gap: var(--login-btn-gap);
              padding-block-start: 20px;
              .registerBtn {
                /* height: 40px; */
              }
              .loginBtn {
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
