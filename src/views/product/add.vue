<template>
  <div class="container add-product">
    <h2>产品基本信息</h2>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addProductParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="addProductParams.productName"
          placeholder="请输入产品名称"
        />
      </el-form-item>
      <br />
      <el-form-item label="出品方" prop="channelId">
        <el-select
          v-model="addProductParams.channelId"
          @focus="getChannelListFunc"
        >
          <el-option
            v-for="item in channelIdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button style="margin-left: 20px" type="text" @click="addLoanGroup"
          >添加贷款机构</el-button
        >
      </el-form-item>
      <br />
      <el-form-item label="产品分类" prop="productType">
        <el-select v-model="addProductParams.productType">
          <el-option
            v-for="item in productTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级" prop="name">
        <el-input
          v-model="addProductParams.name"
          placeholder="请输入数字1-4"
        ></el-input>
      </el-form-item>
      <el-form-item label="" prop="name">
        <el-button type="text" disabled>*用于首页显示</el-button>
      </el-form-item>
      <br />
      <el-form-item label="还款方式" prop="productRepayments">
        <el-checkbox-group v-model="addProductParams.productRepayments">
          <el-checkbox
            name="type"
            v-for="item in productRepaymentOptions"
            :key="item.value"
            :value="item.label"
            :label="item.value"
            >{{ item.label }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <br />
      <el-form-item label="办理方式" prop="productHandle">
        <el-Radio
          v-model="addProductParams.productHandle"
          name="type"
          v-for="item in productHandleOptions"
          :key="item.value"
          :value="item.label"
          :label="item.value"
          >{{ item.label }}</el-Radio
        >
      </el-form-item>
      <br />
      <el-form-item label="是否合作">
        <el-checkbox label="" v-model="isCooperate" name="type" />
      </el-form-item>
      <el-form-item label="是否推荐">
        <el-checkbox label="" v-model="isRecommend" name="type" />
      </el-form-item>
      <br />
      <el-form-item label="所属方案" prop="productSchemes">
        <el-select
          v-model="addProductParams.productSchemes"
          @focus="getSchemeListFunc"
          @change="checkScheme"
        >
          <el-option
            v-for="item in productSchemesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <br />
      <el-form-item
        label="已选方案"
        class="schemes-label"
        v-if="productSchemesArr.length > 0"
      >
        <div class="schemes-list">
          <div
            class="scheme"
            v-for="item in productSchemesArr"
            :key="item.value"
          >
            {{ returnTargetOptionsLabel(item, productSchemesOptions) }}
            <el-icon color="#F56C6C" @click="deleteScheme(item)"
              ><close-bold
            /></el-icon>
          </div>
        </div>
      </el-form-item>
      <br />
      <el-form-item label="产品主数据编码">
        <el-input
          v-model="addProductParams.mainDataCode"
          placeholder="请输入产品主数据编码"
        />
      </el-form-item>
      <br />
      <el-form-item label="跳转链接">
        <el-input
          v-model="addProductParams.directUrl"
          placeholder="请输入跳转链接"
        />
      </el-form-item>
      <el-form-item label="" prop="name">
        <el-button type="text" disabled
          >*纯线上或线上线下结合方式时链接生效</el-button
        >
      </el-form-item>
      <br />

      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button
          type="primary"
          :loading="isLoading"
          @click="submitForm(ruleFormRef)"
          >{{ isEdit ? "保存" : "添加" }}</el-button
        >
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        addProduct
      </el-col>
    </el-row>
    <el-button icon="Search" type="primary" @click="closeTab">关闭标签页</el-button> -->
  </div>
</template>

<script setup name="addProduct">
import {
  getChannelList,
  getSchemeList,
  addProduct,
  getProductDetail,
  editProduct,
} from "@/api";
import { ElMessage } from "element-plus";
import getEnumKeyArr from "@/hooks/getEnumKeyArr";
import { deepClone } from "@/utils";

const route = useRoute();
const { proxy } = getCurrentInstance();

// 产品分类可选数据
let channelIdOptions = ref([]);
// 产品分类可选数据
let productTypeOptions = getEnumKeyArr("enumProductType");
// 产品还款方式可选数据
let productRepaymentOptions = getEnumKeyArr("enumProductRepayment");
// 产品办理方式可选数据
let productHandleOptions = getEnumKeyArr("enumProductHandle");
// 所属方案可选数据
let productSchemesOptions = ref([]);

// 产品参数
const addProductParams = reactive({
  productName: "", // 产品名称
  channelId: "", // 金融机构 ID
  productType: "", // 产品类型(枚举 enumProductType)：1房产抵押贷款 2个人信用贷款 4企业信用贷款 8汽车抵押贷款 16小额贷款(20万以下) 32动产质押贷款
  showPriority: "", // 展示优先级
  productRepayments: [1], // 还款方式(多选，枚举 enumProductRepayment)：1等额本息 2等额本金 4到期还本 8先息后本，按期还本
  productHandle: 2, // 办理方式(多选，枚举 enumProductHandle1)：1纯线上 2纯线下 4线上线下结合 8线上签约，线下办理
  isCooperate: "", // 是否合作：1合作 2不合作
  isRecommend: "", // 是否推荐：1推荐 2不推荐
  productSchemes: "", // 产品方案 IDs(多选)
  mainDataCode: "", // 产品主数据编码
  directUrl: "", // 跳转链接
});
let isCooperate = ref(true);
let isRecommend = ref(true);
let productSchemesArr = ref([]);
let isLoading = ref(false);

// 是否编辑？
let isEdit = ref(false);
let productId = ref("");
if (route.query.isEdit) {
  isEdit.value = true;
  productId.value = route.query.id;
  // getChannelListFunc()
  // getSchemeListFunc()
  getProductDetailFunc();
}

// 产品详情
async function getProductDetailFunc() {
  await getChannelListFunc();
  await getSchemeListFunc();
  getProductDetail(productId.value).then((res) => {
    console.log("getProductDetail: ", res);
    if (res.status) {
      addProductParams.productName = res.data.productName;
      addProductParams.channelId = res.data.channelId;
      addProductParams.productType = res.data.productType;
      addProductParams.showPriority = res.data.showPriority;
      addProductParams.productRepayments = res.data.productRepayments;
      addProductParams.productHandle = res.data.productHandle;
      if (res.data.isCooperate === 2) isCooperate.value = false;
      if (res.data.isRecommend === 2) isRecommend.value = false;
      productSchemesArr.value = res.data.productSchemes;
      let productSchemes = deepClone(res.data.productSchemes);
      addProductParams.productSchemes = productSchemes.pop();
      addProductParams.mainDataCode = res.data.mainDataCode;
      addProductParams.directUrl = res.data.directUrl;
      console.log(productSchemesOptions.value);
      console.log(productSchemesArr.value);
      console.log(channelIdOptions.value);
      console.log(addProductParams);
    }
  });
}

// 获取出品方 金融机构 方法
async function getChannelListFunc() {
  getChannelList().then((res) => {
    if (res.status) {
      console.log("getChannelList: ", res);
      channelIdOptions.value = [];
      res.data.map((item) => {
        item.label = item.channelName;
        item.value = item.id;
      });
      channelIdOptions.value = res.data;
    }
  });
}

// 获取所属方案 方法
async function getSchemeListFunc() {
  getSchemeList().then((res) => {
    if (res.status) {
      console.log("getSchemeList: ", res);
      productSchemesOptions.value = [];
      res.data.map((item) => {
        item.label = item.schemeName;
        item.value = item.id;
      });
      productSchemesOptions.value = res.data;
    }
  });
}

// 选择方案
const checkScheme = (e) => productSchemesArr.value.push(e);

// 删除方案
const deleteScheme = (item) => {
  let index = productSchemesArr.value.indexOf(item);
  productSchemesArr.value.splice(index, 1);
};

// 添加贷款机构
const addLoanGroup = () => {};

// 表单验证
const ruleFormRef = ref();
const rules = reactive({
  productName: [
    {
      required: true,
      message: "请输入产品名称",
      trigger: "blur",
    },
    // {
    //   min: 3,
    //   max: 5,
    //   message: 'Length should be 3 to 5',
    //   trigger: 'blur',
    // },
  ],
  channelId: [
    {
      required: true,
      message: "请选择出品方",
      trigger: "change",
    },
  ],
  productType: [
    {
      required: true,
      message: "请选择产品分类",
      trigger: "change",
    },
  ],
  productRepayments: [
    {
      type: "array",
      required: true,
      message: "请选择还款方式",
      trigger: "change",
    },
  ],
  productHandle: [
    {
      type: "number",
      required: true,
      message: "请选择办理方式",
      trigger: "change",
    },
  ],
  productSchemes: [
    {
      required: true,
      message: "请选择所属方案",
      trigger: "change",
    },
  ],
});

// 添加/保存 按钮
const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      isCooperate.value === true
        ? (addProductParams.isCooperate = 1)
        : (addProductParams.isCooperate = 2);
      isRecommend.value === true
        ? (addProductParams.isRecommend = 1)
        : (addProductParams.isRecommend = 2);
      let newAddProductParams = deepClone(addProductParams);
      newAddProductParams.productSchemes = productSchemesArr.value;
      console.log("addProductParams: ", addProductParams);
      console.log("newAddProductParams: ", newAddProductParams);

      isLoading.value = true;
      if (!isEdit.value) addProductFunc(newAddProductParams);
      else editProductFunc(newAddProductParams);
    } else return;
  });
};

// 新增产品
function addProductFunc(newAddProductParams) {
  addProduct(newAddProductParams).then(
    (res) => {
      console.log("addProduct: ", res);
      isLoading.value = false;
      if (res.status) {
        ElMessage.success(res.message);
        proxy.$tab.closeOpenPage();
        proxy.$tab.openPage("/product/list");
      }
    },
    (err) => (isLoading.value = false)
  );
}

// 保存产品
function editProductFunc(newAddProductParams) {
  editProduct(productId.value, newAddProductParams).then(
    (res) => {
      console.log("editProduct: ", res);
      isLoading.value = false;
      if (res.status) {
        ElMessage.success(res.message);
        proxy.$tab.closeOpenPage();
        proxy.$tab.openPage("/product/list");
      }
    },
    (err) => (isLoading.value = false)
  );
}

// 重置表单
const resetForm = (formEl) => {
  if (!formEl) return;
  if (!isEdit.value) {
    formEl.resetFields();
    productSchemesArr.value = [];
  } else {
    proxy.$tab.closeOpenPage();
    proxy.$tab.openPage("/product/list");
  }
};

// 根据id返回指定的的lebel
const returnTargetOptionsLabel = (key, target) =>
  target.filter((item) => item.value === key)[0].label;
</script>

<style lang="scss" scoped>
.container {
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.add-product {
}

.schemes-label {
  width: 100%;
  .el-form-item__content {
    width: 100%;
  }
}
.schemes-list {
  display: flex;
  width: 100%;
  .scheme {
    flex: 0 1 auto;
    margin: 0 30px 0 0;
    .el-icon {
      cursor: pointer;
    }
  }
}

.button-box {
  margin: 50px 0 0 120px;
}
</style>

