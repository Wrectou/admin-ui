<template>
  <div class="container add-product">

    <h2>产品标签信息</h2>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addProductTagParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item class="input" label="标签名称" prop="tagName">
        <el-input v-model="addProductTagParams.tagName" placeholder="请输入标签名称" />
      </el-form-item>
      <br/>
      <el-form-item label="标签归属" prop="tagAttr">
        <el-select v-model="addProductTagParams.tagAttr">
          <el-option v-for="item in tagAttrOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item class="margin" label="标签分类" prop="tagType">
        <el-select v-model="addProductTagParams.tagType">
          <el-option v-for="item in tagTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <br/>

      <el-form-item class="input" label="优先级" prop="showPriority">
        <el-input v-model="addProductTagParams.showPriority" placeholder="请输入数字1-999之间的数据，越小优先级越高"></el-input>
      </el-form-item>
      <el-form-item label="是否推荐">
        <el-switch v-model="isRecommend" inline-prompt active-text="是" inactive-text="否" />
      </el-form-item>
      <br/>

      <el-form-item class="input" label="Title" prop="pageTitle">
        <el-input v-model="addProductTagParams.pageTitle" placeholder="请输入32字以内" />
      </el-form-item>
      <br/>
      <el-form-item class="input" label="Keywords" prop="pageKeywords">
        <el-input v-model="addProductTagParams.pageKeywords" placeholder="请输入关键词" />
      </el-form-item>
      <br/>
      <el-form-item class="input" label="Description" prop="pageDescription">
        <el-input v-model="addProductTagParams.pageDescription" placeholder="请输入，多个关键词之间使用英文逗号隔开" />
      </el-form-item>
      <br/>
      <el-form-item class="input" label="相关聚合" prop="groupKeyword">
        <el-input v-model="addProductTagParams.groupKeyword" placeholder="请输入相关聚合" />
      </el-form-item>
      <br/>


      
      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)">{{isEdit ? '保存' : '添加'}}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup name="addproductTag">

  import { addProductTag, getProductTagDetail, editProductTag } from "@/api"
  import { ElMessage } from 'element-plus'
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"
  import { deepClone } from "@/utils"

  const route = useRoute()
  const { proxy } = getCurrentInstance()
  
  // 产品标签可选数据
  let tagAttrOptions = getEnumKeyArr('enumTagAttr')
  // 产品标签分类可选数据
  let tagTypeOptions = getEnumKeyArr('enumTagType')
  // 产品还款方式可选数据
  let productRepaymentOptions = getEnumKeyArr('enumProductRepayment')
  // 产品办理方式可选数据
  let productHandleOptions = getEnumKeyArr('enumProductHandle')
  // 所属方案可选数据
  let productSchemesOptions = ref([])
  
  // 产品参数
  const addProductTagParams = reactive({
    tagName: '',    // 产品标签名称
    tagAttr: '',    // 产品标签归属(枚举 enumTagAttr)：1通用 2房 4车 8企业 16金融资产
    tagType: '',    // 产品标签分类(枚举 enumTagType)：1职业身份 2借款人资质 4资产资质 8特殊需求 16产品特征
    showPriority: '',    // 优先级
    isRecommend: '',    // isRecommend
    groupKeyword: '',    // 相关聚合
    pageTitle: '',    // 页面标题
    pageKeywords: '',    // 页面关键字
    pageDescription: '',    // 页面描述
  })
  let isRecommend = ref(false)
  let isLoading = ref(false)

  // 是否编辑？
  let isEdit = ref(false)
  let productTagId = ref('')
  if (route.query.isEdit) {
    isEdit.value = true
    productTagId.value = route.query.id
    getProductTagDetailFunc()
  }
  
  // 产品详情
  async function getProductTagDetailFunc() {
    getProductTagDetail(productTagId.value)
      .then(res => {
        console.log('getProductTagDetail: ', res);
        if (res.status) {
          addProductTagParams.tagName = res.data.tagName
          addProductTagParams.tagAttr = res.data.tagAttr
          addProductTagParams.tagType = res.data.tagType
          addProductTagParams.showPriority = res.data.showPriority
          if (res.data.isRecommend === 1) isRecommend.value = true
          addProductTagParams.groupKeyword = res.data.groupKeyword
          addProductTagParams.pageTitle = res.data.pageTitle
          addProductTagParams.pageKeywords = res.data.pageKeywords
          addProductTagParams.pageDescription = res.data.pageDescription
        }
      })
  }

  // 表单验证
  const ruleFormRef = ref()
  const rules = reactive({
    tagName: [
      {
        required: true,
        message: '请输入产品标签名称',
        trigger: 'blur',
      },
    ],
    tagAttr: [
      {
        required: true,
        message: '请选择产品标签归属',
        trigger: 'change',
      },
    ],
    tagType: [
      {
        required: true,
        message: '请选择产品标签分类',
        trigger: 'change',
      },
    ],
    showPriority: [
      {
        required: true,
        message: '请输入优先级',
        trigger: 'blur',
      },
    ],
    pageTitle: [
      {
        required: true,
        message: '请输入Title',
        trigger: 'blur',
      },
    ],
    pageKeywords: [
      {
        required: true,
        message: '请输入Keywords',
        trigger: 'blur',
      },
    ],
    pageDescription: [
      {
        required: true,
        message: '请输入Description',
        trigger: 'blur',
      },
    ],
    groupKeyword: [
      {
        required: true,
        message: '请输入相关聚合',
        trigger: 'blur',
      },
    ],

  })

  // 添加/保存 按钮
  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        isRecommend.value === true ? addProductTagParams.isRecommend = 1 : addProductTagParams.isRecommend = 2
        console.log('addProductTagParams: ',addProductTagParams);

        isLoading.value = true
        if (!isEdit.value) addProductTagFunc(addProductTagParams)
        else editProductTagFunc(addProductTagParams)

      } else return
    })
  }

  // 新增产品
  function addProductTagFunc(addProductTagParams) {
    addProductTag(addProductTagParams)
      .then(res => {
        console.log('addProductTag: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage("/productTag/list")
        }
      }, err => isLoading.value = false )
  }

  // 保存产品
  function editProductTagFunc(newaddProductTagParams) {
    editProductTag(productTagId.value, newaddProductTagParams)
      .then(res => {
        console.log('editProductTag: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage("/productTag/list")
        }
      }, err => isLoading.value = false )
  }

  // 重置表单
  const resetForm = formEl => {
    if (!formEl) return
    if (!isEdit.value) {
      formEl.resetFields()
    } else {
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage("/productTag/list")
    }
  }
  
</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.input{
  width: 450px;
}
.margin{
  margin: 0 0 0 118px;
}

.button-box{
  margin: 50px 0 0 120px;
}
</style>

