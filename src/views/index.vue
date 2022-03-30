<template>
  <div class="container home">

    <div class="tit">日常学习</div>
    <el-row>
      <el-col :span="3" class="menu-box" v-for="item in menuList" :key="item.name">
        <div class="menu" @click="goLink(item.linkName)">
          <img class="logo" :src="item.logo" />
          <p class="title"> {{item.name}} </p>
        </div>
      </el-col>
    </el-row>

    
    <div class="tit">考试相关</div>
    <el-row>
      <el-col :span="12" class="table-box" v-for="item in tableList" :key="item.name">
        <div class="table" @click="goLink(item.linkName)">
          <img class="logo" :src="item.logo" />
        </div>
      </el-col>
    </el-row>


    <div class="tit">专题学习</div>
    <el-row>
      <el-col :span="6" class="special-box" v-for="item in specialList" :key="item.name">
        <div class="special" @click="goLink(item.linkName)">
          <img class="logo" :src="item.logo" />
          <p class="title"> {{item.name}} </p>
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script setup name="Index">

import { getHomeData, getEnum } from '@/api'
import { useRouter } from 'vue-router'

import icon1 from '@/assets/images/index/1.png'
import icon2 from '@/assets/images/index/2.png'
import icon3 from '@/assets/images/index/3.png'
import icon4 from '@/assets/images/index/4.png'
import icon5 from '@/assets/images/index/5.png'
import icon6 from '@/assets/images/index/6.png'
import icon7 from '@/assets/images/index/7.png'
import icon8 from '@/assets/images/index/8.png'

import table1 from '@/assets/images/index/table1.png'
import table2 from '@/assets/images/index/table2.png'

import special from '@/assets/images/index/special.png'

const router = useRouter()

const { proxy } = getCurrentInstance()

const menuList = reactive([
  { name: '章节练习', linkName: 'chapter', logo: icon1, },
  { name: '题型练习', linkName: 'questionType', logo: icon2, },
  { name: '每日练习', linkName: 'chapter', logo: icon3, },
  { name: '历年真题', linkName: 'chapter', logo: icon4, },
  { name: '模拟考试', linkName: 'chapter', logo: icon5, },
  { name: '错题巩固', linkName: 'chapter', logo: icon6, },
  { name: '我的收藏', linkName: 'chapter', logo: icon7, },
  { name: '学习报告', linkName: 'chapter', logo: icon8, },
])

const tableList = reactive([
  { name: '考试指南', linkName: 'chapter', logo: table1, },
  { name: '我的考试', linkName: 'chapter', logo: table2, },
])

const specialList = reactive([
  { name: '2021年高级考试复习资料', linkName: 'chapter', logo: special, },
  { name: '民警办案实务', linkName: 'chapter', logo: special, },
  { name: '刑事案卷', linkName: 'chapter', logo: special, },
  { name: '行政法律文书', linkName: 'chapter', logo: special, },
  { name: '刑事案卷', linkName: 'chapter', logo: special, },
  { name: '行政法律文书', linkName: 'chapter', logo: special, },
  { name: '2021年高级考试复习资料', linkName: 'chapter', logo: special, },
  { name: '民警办案实务', linkName: 'chapter', logo: special, },
])


const getEnumFunc = () => {
  // getEnum()
  //   .then(res => {
  //     console.log('getEnum: ',res);
  //     if (res.status) proxy.$cache.session.setJSON('Enum', res.data)
  //   })
  proxy.$cache.session.setJSON('Enum', '{"enumAdSite":{"desc":"广告位置","list":{"1":"首页底部","2":"计算器结果","3":"普通文章详情","4":"问答文章详情","5":"专题文章详情","6":"文章标签(列表)","7":"分类产品(列表)","8":"SEO文章(列表)"}},"enumArticleAttr":{"desc":"文章归属","list":{"1":"担保贷款","2":"信用贷款","3":"小额贷款","4":"找贷款","5":"关于","6":"金融机构","7":"计算器"}},"enumArticleTemplate":{"desc":"文章模板","list":{"1":"通用","2":"问答","3":"公告","4":"专题"}},"enumAssetId":{"desc":"所需资产","list":{"1":"按揭房/抵押房","2":"全款房","4":"按揭车","8":"全款车","16":"商业保单","32":"大额存单","64":"理财凭证","128":"个人信用","256":"企业信用"}},"enumAssetType":{"desc":"方案资产大类","list":{"1":"房","2":"车","4":"金融资产","8":"信用资产"}},"enumChannelType":{"desc":"机构类型","list":{"1":"商业银行","2":"消金公司","3":"小贷公司","4":"助贷公司"}},"enumCreditReport":{"desc":"订单征信情况","list":{"1":"良好","2":"有瑕疵","3":"不好","4":"白户","5":"不清楚"}},"enumExpectTime":{"desc":"订单期待借款时间","list":{"1":"一周内","2":"15天内","3":"1月个内","4":"不急"}},"enumJobCategory":{"desc":"订单工作性质","list":{"1":"上班","2":"做生意","3":"自由职业"}},"enumLoanAmountUnit":{"desc":"贷款额度单位","list":{"1":"万","2":"元"}},"enumLoanRateUnit":{"desc":"贷款利率单位","list":{"1":"日","2":"月","3":"年"}},"enumLoanTermUnit":{"desc":"贷款期限单位","list":{"1":"日","2":"月","3":"年"}},"enumOperateMode":{"desc":"业务城市运营方式","list":{"1":"门店直营","2":"有后台运营","3":"有外部经纪人","4":"有加盟门店","5":"有远程营销"}},"enumProcessTimeUnit":{"desc":"贷款办理速度单位","list":{"1":"日","2":"月"}},"enumProductHandle":{"desc":"产品办理方式","list":{"1":"纯线上","2":"纯线下","4":"线上线下结合"}},"enumProductRepayment":{"desc":"产品还款方式","list":{"1":"等额本息","2":"等额本金","4":"到期还本","8":"先息后本，按期还本"}},"enumProductType":{"desc":"贷款产品类型","list":{"1":"房产抵押贷款","2":"个人信用贷款","4":"企业信用贷款","8":"汽车抵押贷款","16":"小额贷款","32":"动产质押贷款"}},"enumSchemeType":{"desc":"方案所属栏目","list":{"1":"担保贷款","2":"信用贷款","3":"小额贷款"}},"enumSource":{"desc":"订单来源","list":{"1":"产品详情","2":"职业身份","3":"资产分类","4":"其他","5":"自定义"}},"enumTagAttr":{"desc":"产品标签归属","list":{"1":"通用","2":"房","4":"车","8":"企业","16":"金融资产"}},"enumTagType":{"desc":"产品标签分类","list":{"1":"职业身份","2":"借款人资质","4":"资产资质","8":"特殊需求","16":"产品特征"}}}')
}
getEnumFunc()

const goLink = name => router.push({ name })

function goTarget(url) {
  window.open(url, "__blank");
}

</script>

<style scoped lang="scss">

.home {
  padding: 40px;
  min-height: 100vh;
}

.menu-box{
  flex: 1;
  margin: 0 10px;
  padding: 0;
}
.menu{
  padding: 20px 0;
  height: 100%;
  background: #ffffff;
  text-align: center;
  transition: transform .3s;
  border-radius: 6px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, .04);
  .logo{
    width: 48px;
    height: 48px;
  }
  .title{
    margin: 6px 0 0;
    font-size: 18px;
  }
}
.menu:hover{
  transform: scale(1.1);
  transition: transform .3s;
  border: solid 1px #f4f4f4;
  cursor: pointer;
}

.table-box{
  flex: 1;
  .table{
    background: #fff;
    margin: 0 10px;
    padding: 20px 0;
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
  }
}

.tit{
  position: relative;
  margin: 30px 0 20px;
  padding: 0 0 0 20px;
  font-size: 20px;
}
.tit:before{
  content: '';
  position: absolute;
  top: 6px;
  left: 10px;
  width: 4px;
  height: 18px;
  background: rgb(64, 158, 255);
}

.special-box{
  .special{
    margin: 0 10px 20px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    .logo{
      width: 390px;
      height: 202px;
    }
    .title{
      padding: 0 0 0 10px;
    }
  }
}


</style>

