<template>
  <div class="container chapter">
    
    <div class="radio-box">
      <el-radio-group v-model="type" @change="typeType">
        <el-radio-button :label="0">练习</el-radio-button>
        <el-radio-button :label="1">试题</el-radio-button>
      </el-radio-group>
    </div>

    <el-row>

      <el-col :span="6" v-for="item in data" :key="item.name">
        <el-card shadow="hover" @click="goLink(item)">
          <div class="card-header">
            <p class="title">
              <p>{{item.name}}</p>
              <el-icon><arrow-right /></el-icon>
            </p>
            <p class="can-do gray">{{item.canDo}}题</p>
          </div>
        </el-card>
      </el-col>

    </el-row>

    <div class="button-box">
      <el-button type="primary">练习全部错题</el-button>
    </div>

  </div>
</template>

<script setup name="errorQuestion">

import { getHomeData, getEnum } from '@/api'

const { proxy } = getCurrentInstance()

const router = useRouter()

let type = ref(0)
const typeType = e => type.value = e

const data = reactive([
  { name: '2020年高级执法资格考试真题', canDo: 100, rate: 3, url: 'errorQuestionAnswer' },
  { name: '2019年高级执法资格考试真题', canDo: 99, rate: 4, url: 'errorQuestionAnswer' },
  { name: '2018年高级执法资格考试真题', canDo: 56, rate: 5, url: 'errorQuestionAnswer' },
  { name: '2017年高级执法资格考试真题', canDo: 30, rate: 2, url: 'errorQuestionAnswer' },
  { name: '2016年高级执法资格考试真题', canDo: 80, rate: 1, url: 'errorQuestionAnswer' },
])

const goLink = item => router.push({ name: item.url, query: { type: item.type } })


</script>

<style scoped lang="scss">

.container{
  padding: 40px;
  text-align: center;
}

.radio-box{
  margin: 0 0 20px;
  padding: 10px;
  text-align: left;
}

::v-deep(.el-col) {
  .el-card{
    margin: 10px;
    cursor: pointer;
  }
}

.card-header,
.card-cont {
  display: flex;
  flex-direction: column;
  align-items: start;
}
.card-header{
  p{
    margin: 0;
    flex: 1;
  }
  .title{
    display: flex;
    align-items: center;
    width: 100%;
    >p{
      flex: 1;
      text-align: left;
    }
  }
  .can-do{
    font-size: 13px;
  }
  .gray{
    margin: 10px 0 0;
    color: #999;
  }
}
.card-cont{
  align-items: end;
}
.num{
  color: #A8ABB2;
}

.button-box{
  margin: 10px 0;
  text-align: right;
}
</style>