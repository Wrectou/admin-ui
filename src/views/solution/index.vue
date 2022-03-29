<template>
  <div class="solution">
    <!-- 控制台 -->
    <div class="control">
      <div class="control-left">
        <el-select
          v-model="queryParams.schemeType"
          class="m-2 length"
          placeholder="所属栏目"
        >
          <el-option
            v-for="item in column"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="queryParams.isRecommend"
          class="m-2 length"
          placeholder="是否推荐"
        >
          <el-option
            v-for="item in recommend"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-checkbox
          class="length"
          label="已设优先级"
          v-model="hasPriority"
          name="type"
        />
      </div>
      <div class="control-right">
        <el-input
          class="inputwidth"
          v-model="queryParams.keyword"
          placeholder="输入产品名称"
        />
        <el-button icon="Search" type="primary" @click="search">搜索</el-button>
        <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
        <el-button type="primary">+添加解决方案</el-button>
      </div>
    </div>
    <el-table :data="tableData.items" stripe style="width: 100%">
      <el-table-column align="center" prop="schemeName" label="方案名称" />
      <el-table-column align="center" prop="schemeType" label="所属栏目">
        <template #default="scope">{{
          returnTargetOptionsLabel(scope.row.schemeType, column)
        }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="loanAmountDescription"
        label="可带额度"
      />
      <el-table-column align="center" prop="showPriority" label="优先级" />
      <el-table-column align="center" prop="loanTerm" label="贷款期限" />
      <el-table-column align="center" prop="processTime" label="放款速度" />
      <el-table-column align="center" prop="isRecommend" label="是否推荐">
        <template #default="scope">{{
          returnTargetOptionsLabel(scope.row.isRecommend, recommend)
        }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="300px
      "
      >
        <template #default="scope">
          <el-button size="small" type="primary" @click="particulars(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="setProductCity(scope.row)"
            >城市配置</el-button
          >
          <el-button size="small" type="info" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      @pagination="getsolutionlist"
      v-show="tableData.meta.total > 0"
      :total="tableData.meta.total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.perPage"
    />
  </div>
</template>
  
<script setup name="solutionindex">
import { getsolutionlist, deletesolution } from "@/api";
const { proxy } = getCurrentInstance();
const router = useRouter();

const column = [
  { value: 1, label: "担保贷款" },
  { value: 2, label: "信用贷款" },
  { value: 3, label: "小额贷款" },
];
const recommend = [
  { value: 1, label: "是" },
  { value: 2, label: "否" },
];

const queryParams = reactive({
  perPage: 10,
  page: 1,
  isRecommend: null, //是否推荐：1推荐 2不推荐
  schemeType: null, //所属栏目(枚举 enumSchemeType)：1担保贷款 2信用贷款 3小额贷款
  hasPriority: null, //是否已设优先级：1是 2否
  keyword: null, //搜索：方案名称
});
let hasPriority = ref(true);

//列表返回的数据
const tableData = reactive({
  meta: {},
  items: [],
});

function getsolution() {
  getsolutionlist(queryParams).then((res) => {
    console.log(res);
    tableData.items = res.data.items;
    tableData.meta = res.data.meta;
  });
}
getsolution();

//搜索
const search = () => {
  queryParams.hasPriority = hasPriority ? 1 : 2;
  getsolution();
};

//重置
const resetFormParams = () => {
  for (let key in queryParams) {
    queryParams[key] = null;
  }
  queryParams.pageNum = 1;
  queryParams.pageSize = 10;
  getsolution();
};

// 编辑
const particulars = (row) => {
  console.log(row);
};

// 城市配置
const setProductCity = (row) => {
  console.log(row);
  router.push({
    name: "cityconfiguration",
    query: { id: row.id },
  });
};

// 删除
const handleDelete = (row) => {
  console.log(row);
  proxy.$modal.confirm(`确认删除该方案吗？`).then(
    () => {
      deletesolution(row.id).then((res) => {
        console.log("deletesolution: ", res);
        if (res.status) proxy.$modal.msgSuccess("删除成功");
        getsolution();
      });
    },
    (err) => {}
  );
};

// 根据id返回指定的的lebel
const returnTargetOptionsLabel = (key, target) => {
  if (!key) return;
  return target.filter((item) => item.value === key)[0].label;
};
</script>

<style lang="scss" scoped>
.solution {
  margin: 20px;
  padding: 20px;
  background: #ffffff;
  .control {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .control-left {
      .length {
        margin-left: 10px;
      }
    }
    .inputwidth {
      width: 200px;
    }
  }
}
</style>