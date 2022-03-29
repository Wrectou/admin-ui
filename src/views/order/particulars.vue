<template>
  <div class="orderparticulars">
    <h1>订单详情</h1>

    <div class="basic-information">
      <h3>基础信息</h3>
      <el-divider border-style="dotted" />
      <div class="information">
        <p>名称：{{ backData.data.orderName }}</p>
        <p>
          是否已处理:<el-select
            disabled
            v-model="backData.data.dealStatus"
            class="m-2"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </p>
        <p>客户姓名：{{ backData.data.customerName }}</p>
        <p>申请城市：{{ backData.data.cityName }}</p>
        <p>
          来源：{{
            returnTargetOptionsLabel(backData.data.source, sourceOptions)
          }}
        </p>
        <p>创建时间：{{ backData.data.customerName }}</p>
      </div>
    </div>

    <div class="assessment">
      <h3>评估信息</h3>
      <el-divider border-style="dotted" />
      <div class="information">
        <p>
          工作性质：{{
            returnTargetOptionsLabel(backData.data.jobCategory, jobCategory)
          }}
        </p>
        <p>借多少钱：{{ backData.data.loanAmountCn }}</p>
        <p>贷多少时间：{{ backData.data.loanTermCn }}</p>
        <p>
          何时用钱：{{
            returnTargetOptionsLabel(backData.data.expectTime, expectTime)
          }}
        </p>
        <p>必须要资产情况：{{ backData.data.necessaryAssetsCn }}</p>
        <p>补充资产情况：{{ backData.data.suppleAssetsCn }}</p>
        <p>
          近2年征信:{{
            returnTargetOptionsLabel(backData.data.creditReport, creditReport)
          }}
        </p>
      </div>
    </div>

    <div class="remark">
      <h3>备注</h3>
      <el-divider border-style="dotted" />
      <textarea name="" id="" cols="120" rows="10"></textarea>
    </div>
  </div>
</template>

<script setup>
import { getOrderparticulars } from "@/api";
import { reactive } from "vue-demi";

const route = useRoute();

const Orderparticulars = () => {
  //获取当前详情
  getOrderparticulars(route.query.id).then((res) => {
    backData.data = res.data;
  });
};
Orderparticulars();

// 根据id返回指定的的lebel
const returnTargetOptionsLabel = (key, target) => {
  if (!key) return;
  return target.filter((item) => item.value === key)[0].label;
};

//返回的数据
const backData = reactive({
  data: {},
});
//处理状态
let statusOptions = [
  { value: 0, label: "未处理" },
  { value: 1, label: "已处理" },
];
//来源
let sourceOptions = [
  { value: 1, label: "产品详情" },
  { value: 2, label: "职业身份" },
  { value: 3, label: "资产分类" },
  { value: 4, label: "其他 " },
  { value: 5, label: "自定义" },
];
//何时用钱
let expectTime = [
  { value: 1, label: "一周内" },
  { value: 2, label: "15天内" },
  { value: 3, label: "1月个内" },
  { value: 4, label: "不急 " },
];
//征信情况
let creditReport = [
  { value: 1, label: "良好" },
  { value: 2, label: "有瑕疵" },
  { value: 3, label: "不好" },
  { value: 4, label: "白户 " },
  { value: 5, label: "不清楚 " },
];
//工作性质
let jobCategory = [
  { value: 1, label: "上班" },
  { value: 2, label: "做生意" },
  { value: 3, label: "自由职业" },
];
</script>

<style lang="scss" scoped>
.orderparticulars {
  padding: 25px;
  .basic-information,
  .assessment,
  .remark {
    padding-left: 30px;
    margin-top: 50px;
    h3 {
      font-weight: 600;
    }
    .information {
      margin-left: 20px;
    }
    .el-divider {
      background-color: #bebebe;
    }
  }
}
</style>