<template>
  <div class="container add-product">

    <h2>文章内容信息</h2>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addProductParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item class="input" label="文章标题" prop="articleName">
        <el-input disabled v-model="addProductParams.articleName" placeholder="请输入文章标题" />
      </el-form-item>
      <br/>
      <el-form-item label="城市" prop="operateCities">
        <div>{{addProductParams.operateCities}}</div>
      </el-form-item>
      <br/>
      <el-form-item class="input" label="关联标签" prop="articleLabel">
        <el-input v-model="addProductParams.articleLabel" placeholder="请输入关联标签" />
        <div>请以英文逗号","隔开每个标签。</div>
      </el-form-item>
      <br/>
      <el-form-item label="封面" prop="productName">
        <el-upload
          class="uploader"
          :action="qiniuBaseURL"
          :data="qiniuConfig"
          :show-file-list="false"
          :on-success="handleArticleCoverSuccess"
        >
          <img v-if="addProductParams.articleCover" :src="addProductParams.articleCover" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
        </el-upload>
      </el-form-item>
      <br/>
      <el-form-item label="归属" prop="articleAttr">
        <el-radio-group v-model="addProductParams.articleAttr">
          <el-radio name="type" v-for="item in articleAttrOptions" :key="item.value" :value="item.label" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <br/>
      <el-form-item label="模板" prop="articleTemplate">
        <el-select v-model="addProductParams.articleTemplate">
          <el-option v-for="item in articleTemplateOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <br/>
      <el-form-item label="内容" prop="entryCondition">
        <TinymceEditor 
          ref="editor" 
          :disabled="true"
          :placeholder="'请输入产品描述'"
          :modelValue="addProductParams.articleContent"
          v-model="addProductParams.articleContent"
        />
      </el-form-item>
      <br/>
      <el-form-item label="是否推荐">
        <el-switch v-model="isRecommend" inline-prompt active-text="是" inactive-text="否" />
      </el-form-item>
      <br/>
      <el-form-item label="是否头条">
        <el-switch v-model="isHeadline" inline-prompt active-text="是" inactive-text="否" />
      </el-form-item>
      <br/>

      
      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)">{{isEdit ? '保存' : '添加'}}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup name="addArticle">

  import { getQiniuConfig, addProduct, getArticleDetail, editArticle } from "@/api"
  import { ElMessage } from 'element-plus'
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"
  import { deepClone } from "@/utils"

  import TinymceEditor from '@/components/tinymceEditor'

  const route = useRoute()
  const { proxy } = getCurrentInstance()

  let articleAttrOptions = getEnumKeyArr('enumArticleAttr')
  let articleTemplateOptions = getEnumKeyArr('enumArticleTemplate')
  let trueFalseOptions = [ { value: 1, label: '是', }, { value: 2, label: '否', } ]
  
  const qiniuBaseURL = ref(import.meta.env.VITE_APP_QINIU)
  let qiniuConfig = ref({})
  function getQiniuConfigFunc() {
    getQiniuConfig()
      .then(res => {
        console.log('getQiniuConfigFunc: ',res);
        if (res.status) qiniuConfig.value = res.data
      })
  }
  getQiniuConfigFunc()
  const handleArticleCoverSuccess = (res, file) => addProductParams.articleCover = `https://${qiniuConfig.value.prefix}/${res.key}`
  
  // 产品参数
  const addProductParams = reactive({
    articleName: '',
    operateCityIds: [],
    operateCities: '',
    articleLabel: '',
    articleCover: '',
    articleAttr: '',
    articleTemplate: '',
    articleContent: '',
    isRecommend: '',
    isHeadline: '',
  })
  let isHeadline = ref(true)
  let isRecommend = ref(true)
  let isLoading = ref(false)

  // 是否编辑？
  let isEdit = ref(false)
  let articleId = ref('')
  if (route.query.isEdit) {
    isEdit.value = true
    articleId.value = route.query.id
    getArticleDetailFunc()
  }
  
  // 产品详情
  async function getArticleDetailFunc() {
    getArticleDetail(articleId.value)
      .then(res => {
        console.log('getArticleDetail: ', res);
        if (res.status) {
          addProductParams.articleName = res.data.articleName
          addProductParams.operateCityIds = res.data.operateCityIds
          addProductParams.operateCities = res.data.operateCities
          addProductParams.articleLabel = res.data.articleLabel
          addProductParams.articleCover = res.data.articleCover
          addProductParams.articleAttr = res.data.articleAttr
          addProductParams.articleTemplate = res.data.articleTemplate
          addProductParams.articleContent = res.data.articleContent
          if (res.data.isHeadline === 2) isHeadline.value = false
          if (res.data.isRecommend === 2) isRecommend.value = false
          addProductParams.isRecommend = res.data.isRecommend
          addProductParams.isHeadline = res.data.isHeadline
        }
      })
  }

  const ruleFormRef = ref()
  const rules = reactive({
    articleLabel: [
      {
        required: true,
        message: '请输入关联标签',
        trigger: 'blur',
      },
    ],
    articleAttr: [
      {
        required: true,
        message: '请选择归属',
        trigger: 'change',
      },
    ],
    articleTemplate: [
      {
        required: true,
        message: '请选择模板',
        trigger: 'change',
      },
    ],
  })

  // 添加/保存 按钮
  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        isHeadline.value === true ? addProductParams.isHeadline = 1 : addProductParams.isHeadline = 2
        isRecommend.value === true ? addProductParams.isRecommend = 1 : addProductParams.isRecommend = 2
        console.log('addProductParams: ',addProductParams);

        let newAddProductParams = deepClone(addProductParams)
        newAddProductParams.articleAttr = newAddProductParams.articleAttr.toString()

        isLoading.value = true
        editArticleFunc(newAddProductParams)

      } else return
    })
  }

  // 保存产品
  function editArticleFunc(newAddProductParams) {
    editArticle(articleId.value, newAddProductParams)
      .then(res => {
        console.log('editArticle: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage("/article/list")
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
      proxy.$tab.openPage("/product/list")
    }
  }
  
  // 根据id返回指定的的lebel
  const returnTargetOptionsLabel = (key, target) => target.filter(item => item.value === key )[0].label

</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.add-product {
  
}

.input{
  width: 60vw;
}

.uploader{
  ::v-deep(.el-upload){
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .avatar-uploader-icon{
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    } 
  }
}

.button-box{
  margin: 50px 0 0 120px;
}
</style>

