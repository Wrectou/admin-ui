<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="getters.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div @click="goRepalce" v-if="isShowBack" style="float: left; height: 100%; display: inline-flex; align-items: center;">
      <el-icon style="color: #333;"><ArrowLeftBold /></el-icon>
    </div>
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!$store.state.settings.topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="$store.state.settings.topNav" />

    <div class="right-menu">
      <template v-if="getters.device !== 'mobile'">
        <!-- <header-search id="header-search" class="right-menu-item" /> -->

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>
      <div class="avatar-container">

        <el-select v-if="!isSystem" class="level-select" v-model="level" @change="levelChange">
          <el-option label="基本级执法资格考试" value="0" />
          <el-option label="高级执法资格考试" value="1" />
        </el-select>

        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="getters.avatar" class="user-avatar" />
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="setLayout">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import HeaderSearch from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'

import { ArrowLeftBold } from '@element-plus/icons-vue'

const store = useStore();
const getters = computed(() => store.getters);

const route = useRoute()
const router = useRouter()

let isShowBack = ref(false)
let replacePath = ref('')

const back = () => {
  // console.log(route);
  // console.log(route.name);
  const nowRouteName = route.name
  // console.log(router);
  // console.log(router.options.routes);
  router.options.routes.forEach(item => {
    if (item.children) {
      item.children.find(i => {
        if (i.name === nowRouteName) {
          if (item.path !== '' && item.children[0].path !== '') replacePath.value = item.path + '/' + item.children[0].path
          else if (item.path !== '' || item.children[0].path !== '') replacePath.value = item.children[0].path
          // console.log('item.path: ',item.path);
          // console.log('item.children[0].path: ',item.children[0].path);
          // console.log('replacePath.value: ',replacePath.value);
          // console.log('router.path: ',route.path);
          if (route.path === replacePath.value) isShowBack.value = false
          else isShowBack.value = true
        }
      })
    }
  })
}
watch(() => route.name, () => {
  back()
})

const goRepalce = () => router.replace({path: replacePath.value})

const { proxy } = getCurrentInstance()


// 系统管理员显示欢迎文字，不跳转模块
let isSystem = ref(false)
if (store.getters.roles.includes('all')) isSystem.value = true

let level = ref("0")
if (proxy.$cache.session.getJSON('level')) level.value = proxy.$cache.session.getJSON('level')
else {
  level.value = "0"
  proxy.$cache.session.setJSON('level', level.value)
}

const levelChange = e => {
  console.log(e);
  level.value = e
  proxy.$cache.session.setJSON('level', level.value)
  location.reload()
}

function toggleSideBar() {
  store.dispatch('app/toggleSideBar')
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.dispatch('LogOut').then(() => {
      location.href = '/index';
    })
  }).catch(() => { });
}

const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout');
}
</script>

<style lang='scss' scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      display: flex;
      align-items: center;

      .level-select{
        margin: 0 10px 0 0;
      }

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
