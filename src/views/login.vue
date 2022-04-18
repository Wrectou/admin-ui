<template>
  <div class="container">

    <el-row class="login-box">
      <el-col :span="12">
        <div class="back">
          <h2 class="title">智慧学法</h2>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="login">

          <el-form ref="loginRef" :model="loginParams" :rules="loginRules" class="login-form">
            <!-- <h3 class="title">智慧学法</h3> -->
            <el-form-item prop="username">
              <el-input
                v-model="loginParams.username"
                type="text"
                size="large"
                auto-complete="off"
                placeholder="账号"
              >
                <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginParams.password"
                type="password"
                size="large"
                auto-complete="off"
                placeholder="密码"
                @keyup.enter="handleLogin"
              >
                <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
              </el-input>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button
                round
                :loading="isLoading"
                size="large"
                type="primary"
                style="width:100%;"
                @click.prevent="handleLogin"
              >
                <span v-if="!isLoading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>
          
        </div>

      
      </el-col>
    </el-row>

  </div>
</template>

<script setup>

  const store = useStore()
  const router = useRouter()
  const { proxy } = getCurrentInstance()

  const loginParams = reactive({
    username: "admin",
    password: "admin123",
  })

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
.container {
  margin-bottom: 100px;
  background: #5490e6 url("../assets/images/login-background.png") center bottom no-repeat;
  background-size: cover;
  height: 100%;
  .login-box{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 1030px;
    height: 100%;
  }
}

.back{
  padding: 180px 0 0;
  height: 500px;
  background: rgba(255,255,255,.2);
  .title{
    color: #fff;
    font-size: 44px;
    text-shadow: 0 2px 4px rgb(0 0 0 / 25%);
    text-align: center;
  }
}

.login{
  height: 500px;
  background: #fff;
}


.login-form {
  border-radius: 6px;
  background: #ffffff;
  padding: 150px 40px 40px 40px;
  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }
  .el-input {
    margin: 0 0 16px 0;
    height: 42px;
    ::v-deep(.el-input__inner) {
      padding-left: calc(5px + 20px + 16px);
      height: 42px;
      font-size: 16px;
      box-shadow: none;
      border-bottom: 1px solid #ccc;
      border-radius: 0;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
  ::v-deep(.el-button){
    margin: 14px 0 0;
    height: 46px;
    font-size: 20px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
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
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>