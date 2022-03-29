<template>
  <div class="order">
    <div class="search">
      <!-- <el-form :model="queryParams" ref="queryRef"> -->
      <div class="searchone">
        <el-select
          v-model="queryParams.cityCode"
          class="m-2 inputlength"
          placeholder="城市选择"
        >
          <el-option
            v-for="item in citylist"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <div class="demo-date-picker inputlength">
          <div class="block">
            <el-date-picker
              v-model="timeStr"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </div>
        </div>

        <el-input
          v-model="queryParams.orderNo"
          class="inputlength"
          placeholder="订单编号"
        />

        <el-input
          v-model="queryParams.orderName"
          class="inputlength"
          placeholder="订单名称"
        />

        <el-input
          v-model="queryParams.customerName"
          class="inputlength"
          placeholder="客户姓名"
        />

        <el-input
          v-model="queryParams.customerMobile"
          class="inputlength"
          placeholder="客户电话"
        />
        <el-select
          v-model="queryParams.source"
          class="m-2 inputlength"
          placeholder="来源"
        >
          <el-option
            v-for="item in sourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="searchtwo">
        <el-input
          v-model="queryParams.customSource"
          class="inputlength"
          placeholder="自定义来源"
        />

        <el-select
          v-model="queryParams.dealStatus"
          class="m-2 inputlength"
          placeholder="处理状态"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <!-- </el-form> -->
    </div>
    <div class="btn">
      <el-button icon="Search" type="primary" @click="search">搜索</el-button>
      <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
    </div>
    <el-table :data="tableData.items" stripe style="width: 100%">
      <el-table-column align="center" prop="orderNo" label="编号" />
      <el-table-column align="center" prop="orderName" label="名称" />
      <el-table-column align="center" prop="source" label="来源">
        <template #default="scope">{{
          returnTargetOptionsLabel(scope.row.source, sourceOptions)
        }}</template>
      </el-table-column>

      <el-table-column align="center" prop="customerName" label="客户" />
      <el-table-column align="center" prop="cityName" label="申请城市" />
      <el-table-column align="center" prop="dealStatus" label="处理状态">
        <template #default="scope">
          {{
            returnTargetOptionsLabel(scope.row.dealStatus, statusOptions)
          }}</template
        >
      </el-table-column>
      <el-table-column align="center" prop="establish" label="创建时间" />
      <el-table-column align="center" prop="remark" label="备注" />
      <el-table-column
        align="center"
        label="操作"
        width="200px
      "
      >
        <template #default="scope">
          <el-button size="small" type="primary" @click="particulars(scope.row)"
            >详情</el-button
          >
          <el-button size="small" type="info" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      @pagination="getOrderList"
      v-show="tableData.meta.total > 0"
      :total="tableData.meta.total"
      v-model:page="productTagListParams.page"
      v-model:limit="productTagListParams.perPage"
    />
    <!-- <el-pagination
      v-model:currentPage="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[10, 20, 30, 40]"
      :disabled="disabled"
      :background="background"
      :total="tableData.meta.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getOrderList, deleteOrderparticulars } from "@/api";

const router = useRouter();
const { proxy } = getCurrentInstance();

const queryParams = reactive({
  cityCode: null,
  orderNo: null,
  orderName: null,
  customerName: null,
  customerMobile: null,
  source: null,
  customSource: null,
});

//获取列表
const getOrder = () => {
  getOrderList(queryParams).then((res) => {
    console.log(res);
    tableData.items = res.data.items;
    tableData.meta = res.data.meta;
  });
};
getOrder();

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
//详情
const particulars = (row) => {
  router.push({
    name: "orderparticulars",
    query: { id: row.id },
  });
};
//删除
const handleDelete = (row) => {
  console.log(row);
  proxy.$modal.confirm(`确认删除该订单吗？`).then(
    () => {
      deleteOrderparticulars(row.id).then((res) => {
        console.log("deleteOrderparticulars: ", res);
        if (res.status) proxy.$modal.msgSuccess("删除成功");
        getOrder();
      });
    },
    (err) => {}
  );
};

const cityvalue = ref("");

const currentPage4 = ref(4);
const pageSize4 = ref(100);
const disabled = ref(false);
/* const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
}; */

const citylist = [
  {
    value: "四川",
    label: "四川",
  },
  {
    value: "上海",
    label: "上海",
  },
];
const timeStr = ref({});
//列表返回的数据
const tableData = reactive({
  meta: {},
  items: [
    {
      // orderNo: "",
      // name: "",
      // source: "",
      // customerName: "",
      // operateCityName: "",
      // dealStatus: "",
      // establish: "",
      // remark: "",
    },
  ],
});
// 根据id返回指定的的lebel
const returnTargetOptionsLabel = (key, target) => {
  if (!key && typeof key !== "number") return;
  return target.filter((item) => item.value == key)[0].label;
};
//搜索
const search = () => {
  queryParams.startTime = timeStr.value[0];
  queryParams.endTime = timeStr.value[1];
  getOrder();
};
//重置
const resetFormParams = () => {
  for (let key in queryParams) {
    queryParams[key] = null;
  }
  timeStr.value = [];
  queryParams.pageNum = 1;
  queryParams.pageSize = 10;
  getOrder();
};

// 产品订单参数
const productTagListParams = reactive({
  page: 1, // 当前页码，默认 1
  perPage: 10, // 每页数量，默认 10
});
</script>

<style lang="scss" scoped>
.order {
  margin: 20px;
  padding: 20px;
  background: #ffffff;
  .search {
    .searchone {
      display: flex;
    }
    .searchtwo {
      display: flex;
      width: 400px;
    }
  }
  .inputlength {
    flex: 1;
    margin-right: 10px;
  }
}
.btn {
  margin-top: 10px;
}
</style>