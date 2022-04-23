<template>
  <div class="login">

    <el-row v-if="width < 600">
      
      <el-col :sm="12" :lg="6">
        <el-result
          icon="warning"
          title="提示信息"
          sub-title="请用电脑端访问此系统已获得更好体验！"
        >
        </el-result>
      </el-col>

    </el-row>

    <el-row v-else>
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16" class="hidden-md-and-down">
        <div class="title-area">
          <h2>智慧学法</h2>
          <p>依法治国，执政为民</p>
          <p>大力弘扬法治精神， 共筑伟大中国梦。</p>
        </div>
      </el-col>
      <el-col :xs="22" :sm="22" :md="22" :lg="8" :xl="8">
        <el-form ref="loginRef" :model="loginParams" :rules="loginRules" class="login-form" label-position="top">
          <h3 class="title">登录</h3>
          <el-form-item prop="username" label="用户名/手机号">
            <el-input
              v-model="loginParams.username"
              type="text"
              auto-complete="off"
              placeholder="请输入用户名/手机号"
            >
              <!-- <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template> -->
            </el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码" class="password">
            <el-input
              v-model="loginParams.password"
              :type="isShow?'text':'password'"
              auto-complete="off"
              placeholder="请输入密码"
              @keyup.enter="handleLogin"
            >
              <!-- <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template> -->
            </el-input>
            <div :class="['iconfont', isShow?'icon-icon_close_eyes_open':'icon-icon_close_eyes']" @click="isShow = !isShow"></div>
          </el-form-item>
          <el-form-item style="width:100%;">
            <el-button
              :loading="isLoading"
              type="primary"
              class="btn"
              round
              @click.prevent="handleLogin"
            >
              <span v-if="!isLoading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
     </el-col>
    </el-row>
    

  </div>
</template>

<script setup>

  import { useWindowSize } from '@vueuse/core'

  const store = useStore()
  const router = useRouter()
  const { proxy } = getCurrentInstance()

  const loginParams = reactive({
    username: "",
    password: "",
  })

  const { width } = useWindowSize()

  const isShow = ref(false)

  const loginRules = {
    username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
    password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  }

  const isLoading = ref(false)
  const redirect = ref(undefined)

  const handleLogin = () => {
    proxy.$refs.loginRef.validate(valid => {
      if (valid) {
        isLoading.value = true
        store.dispatch("Login", loginParams)
          .then(() => {
            router.push({ path: redirect.value || "/" })
            isLoading.value = false
          }, err => {
            console.log(err);
            isLoading.value = false
          } )
      }
    })
  }

</script>

<style lang='scss' scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}
.login::after{
   content: "";
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    z-index: 2;
    background-image: url("@/assets/images/login-bg.png");
    background-size: cover;
}
.title {
  margin: 0px auto 50px auto;
  text-align: center;
  color: #0486FE;
  font-size: 22px;
  font-weight: bold;
}

.login-form {
  width: 400px;
  padding: 50px 50px 40px;
  background: #FFFFFF;
  box-shadow: 0px 1px 17px 5px rgba(217, 217, 217, 0.37);
  border-radius: 20px;
  position: relative;
  z-index: 999;
  ::v-deep(.el-input) {
    height: 38px;
   
    input {
      height: 38px;
      box-shadow: none;
      border: none !important;
      border-bottom: 1px solid #E3E3E3 !important;
      padding-left: 10px;
    }
  }
  .password{
    position: relative;
    input{
      padding-right: 40px;
    }
    .iconfont{
      font-size: 12px;
      color: #eee;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 999;
      cursor: pointer;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
  .btn{
    width:100%; 
    height:50px;
    border-radius: 26px;
  }
}

.login-form .el-form-item__label{
  color: #D9D9D9 !important;
  padding-bottom: 0;
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #999;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
  z-index: 999;
  flex: 1 0 100%;
  line-height: 1.5;
  a{
    color: #999;
  }
}
.login-code-img {
  height: 38px;
}
.title-area{
  position: relative;
  margin-right: 86px;
  z-index: 999;
  h2{
    font-size: 100px;
    color: #171717;
    font-weight: bold;
    margin-bottom: 20px;
  }
  p{
    font-size: 20px;
    color: #171717;
    font-weight: bold;
    line-height: 1.5;
  }
}
@media screen and (max-width: 768px) {
  #app{
    background-color: initial;
  }
  .login {
    // background: #999;
    filter:(12px)
  }
  .login:after{
    filter: blur(10px);
    opacity: 0.1;
}
  .login-form {
    width: 330px;
    padding: 30px 40px;
    box-shadow: 0px 1px 17px 1px rgb(217 217 217 / 37%);
    .btn{
      height:42px;
    }
  }
  .title{
    margin-bottom: 30px;
  }
  // .el-login-footer {
  //   color: #fff;
  // }
}
@media screen and (min-width: 1204px) and (max-width: 1440px) {
  .title-area h2{
    font-size: 80px;
    padding-top: 0px;
  }
  .title-area p{
    font-size: 16px;
    line-height: 1;
  }
}
</style>