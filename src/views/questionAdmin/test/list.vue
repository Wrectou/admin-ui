<template>
  <div class="container product-list">

    <!-- 列表搜索项 -->
    <el-form :model="listParams" ref="queryRef" :inline="true">
      <el-row class="control-bar">
        <el-col :span="20" class="control-left">
          <el-col :span="5">
            <el-form-item label="题目类型" prop="level">
              <el-select v-model="listParams.level">
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="考试类型" prop="etype">
              <el-select v-model="listParams.etype">
                <el-option v-for="item in etypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="name" class="search-input">
              <el-input v-model="listParams.name" placeholder="输入试卷名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button icon="Search" type="primary" @click="searchList">搜索</el-button>
            <el-button icon="Refresh" @click="resetListParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addTest">添加试卷</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格 -->
    <el-table v-loading="isLoading" :data="listData.items" style="width: 100%;">
      <el-table-column label="试卷名称" align="center" prop="name" />
      <el-table-column label="考试类型" align="center" prop="etype">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.etype, etypeOptions)}}</template>
      </el-table-column>
      <el-table-column label="题目类型" align="center" prop="level">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.level, levelOptions)}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400">
        <template #default="scope">
          <el-button type="primary" @click="editTest(scope.row)">编辑</el-button>
          <el-button type="success" @click="setTestPerson(scope.row)">人员管理</el-button>
          <el-button type="danger" @click="setTestSubject(scope.row)">试题管理</el-button>
          <el-button type="info" @click="deleteTest(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <pagination @pagination="searchList" v-show="listData.total > 0" :total="listData.total" v-model:page="listParams.pageNum" v-model:limit="listParams.pageSize" />

    <!-- 添加试卷弹窗 -->
    <el-dialog
      v-model="addTestVisible"
      title="试卷基本信息"
      width="68%"
      :close-on-click-modal="false"
      :before-close="addHandleClose"
    >
      <!-- 弹窗内容 -->
      <div class="dialog-content add-test">

        <el-form
          ref="addRuleFormRef"
          :inline="true"
          :model="addParams"
          :rules="addRules"
          label-width="90px"
          class="add-form"
        >
          <el-form-item label="试卷名称" class="name" prop="name">
            <el-input v-model="addParams.name" placeholder="请输入试卷名称" />
          </el-form-item>
          <br />
          <el-form-item label="考试类型" prop="etype">
            <el-select v-model="addParams.etype">
              <el-option v-for="item in etypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="题目类型" prop="level">
            <el-select v-model="addParams.level">
              <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="总分数" prop="totalScore">
            <el-input v-model.number="addParams.totalScore" type="number" placeholder="请输入总分数">
              <template #append>分</template>
            </el-input>
          </el-form-item>
          <el-form-item label="合格分数" prop="qualifiedScore">
            <el-input v-model.number="addParams.qualifiedScore" type="number" placeholder="请输入合格分数">
              <template #append>分</template>
            </el-input>
          </el-form-item>
          <br />
          <el-form-item label="考试时长" prop="duration">
            <el-input v-model.number="addParams.duration" type="number" placeholder="请输入考试时长">
              <template #append>分钟</template>
            </el-input>
          </el-form-item>
          <el-form-item label="考试难度" prop="difficulty">
            <el-rate v-model="addParams.difficulty" show-score text-color="#ff9900" :score-template="''" />
          </el-form-item>
          <br />
          <el-form-item label="开考时间" prop="startTime">
            <el-date-picker v-model="addParams.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开考时间" />
          </el-form-item>
          <el-form-item label="停考时间" prop="endTime">
            <el-date-picker v-model="addParams.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择停考时间" />
          </el-form-item>
          <br />

          <el-form-item class="button-box">
            <!-- <el-button @click="resetAddForm(addRuleFormRef)">取消</el-button> -->
            <el-button type="primary" :loading="addTestLoading" @click="submitAddForm(addRuleFormRef)"  >{{ isEdit ? "保存" : "添加" }}</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-dialog>


    <!-- 考试人员管理弹窗 -->
    <el-dialog
      v-model="setTestPersonVisible"
      title="考试人员管理"
      width="76%"
      :close-on-click-modal="false"
      :before-close="setTestPersonHandleClose"
    >
      <!-- 弹窗内容 -->
      <div class="dialog-content add-person">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="tree-content person-tree-content">
              <el-tree 
                ref="refPersonTree"
                node-key="id"
                :data="personTreeData" 
                :props="personTreeDefaultProps" 
                show-checkbox 
                @check-change="handleCheckPersonTreeChange"
              />
            </div>
          </el-col>
          <el-col :span="11">
            <div class="checked-content person-checked-content">
              <div class="title">已选（{{personTreeCheckedData.length}}）人</div>
              <div class="checked-list">
                <div class="checked" v-for="item in personTreeCheckedData" :key="item.id" @click="deleteTestPerson(item)">
                  {{item.name}}（{{item.parentName}}）
                  <el-icon><circle-close-filled /></el-icon>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="button-box">
          <el-button type="primary" :loading="setTestPersonLoading" @click="addEpaperUserFunc">保存</el-button>
        </div>
      </div>
    </el-dialog>


    <!-- 试题管理弹窗 -->
    <el-dialog
      v-model="setTestSubjectVisible"
      title="考试试题管理"
      width="76%"
      :close-on-click-modal="false"
      :before-close="setTestSubjectHandleClose"
    >
      <!-- 弹窗内容 -->
      <div class="dialog-content add-person">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="tree-content person-tree-content">
              <el-tree 
                ref="refSubjectTree"
                node-key="id"
                :data="subjectTreeData" 
                :props="subjectTreeDefaultProps" 
                show-checkbox 
                @check-change="handleCheckSubjectTreeChange"
              />
            </div>
          </el-col>
          <el-col :span="11">
            <div class="checked-content person-checked-content">
              <div class="title">
                <div>已选（{{subjectTreeCheckedData.length}}）题</div>
                <div>共（{{subjectTreeCheckedDataAllScore}}）分</div>
              </div>
              <div class="checked-list">
                <div class="checked" v-for="item in subjectTreeCheckedData" :key="item.id" @click="deleteTestSubject(item)">
                  {{item.title}}
                  <el-icon><circle-close-filled /></el-icon>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="button-box">
          <el-button type="primary" :loading="setTestSubjectLoading" @click="addEpaperQuestionFunc">保存</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script setup name="questionAdminTestList">
  
  import { ElMessage, ElMessageBox } from 'element-plus'

  import { getAdminEpaperList, addEpaper, getEpaperDetail, editEpaper, deleteEpaper, getDeptUsersList, addEpaperUser, getEpaperUserList, deleteEpaperUser, getAllSectionQuestionList, addEpaperQuestion, getEpaperQuestionList, deleteEpaperQuestion } from "@/api"

  const router = useRouter()
  
  const { proxy } = getCurrentInstance()

  // 题目类型
  let levelOptions = [
    { value: 0, label: '基本级执法资格考试'},
    { value: 1, label: '高级执法资格考试'},
  ]
  // 难度
  let difficultyOptions = [
    { value: 1, label: '1星'},
    { value: 2, label: '2星'},
    { value: 3, label: '3星'},
    { value: 4, label: '4星'},
    { value: 5, label: '5星'},
  ]
  // 考试类型
  let etypeOptions = [
    { value: 0, label: '历年真题'},
    { value: 1, label: '模拟考试'},
    { value: 2, label: '正式考试'},
  ]
  



  // 列表参数
  const listParams = reactive({
    pageNum: 1,
    pageSize: 10,
    level: '',
    etype: '',
    name: '',
  })
  // 列表加载
  let isLoading = ref(false)
  // 列表数据
  const listData = reactive({
    total: 0,
    items: []
  })
  // 获取列表
  function searchList() {
    isLoading.value = true
    getAdminEpaperList(listParams)
      .then(res => {
        console.log('getAdminEpaperList: ',res);
        isLoading.value = false
        listData.total = res.total
        listData.items = res.rows
      }, err => isLoading.value = false )
  }
  searchList()
  // 重置搜索项
  const resetListParams = () => {
    proxy.resetForm("queryRef")
    searchList()
  }




  // 添加弹出框是否显示
  let addTestVisible = ref(false)
  // 添加试卷loading
  let addTestLoading = ref(false)
  // 是否编辑
  let isEdit = ref(false)
  //  添加参数
  const addParams = reactive({
    difficulty: 0,
    startTime: '',
    endTime: '',
    duration: '',
    etype: '',
    level: '',
    name: '',
    qualifiedScore: '',
    totalScore: '',
  })
  // 表单验证
  const addRuleFormRef = ref()
  const addRules = reactive({
    name: [ { required: true, message: "请输入试卷名称", trigger: "blur" } ],
    etype: [ { required: true, message: "请选择考试类型", trigger: "change" } ],
    level: [ { required: true, message: "请选择题目类型", trigger: "change" } ],
    totalScore: [ { required: true, message: "请输入总分数", trigger: "blur" } ],
    qualifiedScore: [ { required: true, message: "请输入合格分数", trigger: "blur" } ],
    duration: [ { required: true, message: "请输入考试时长", trigger: "blur" } ],
    difficulty: [ { required: true, message: "请选择考试难度", trigger: "change" } ],
  })
  // 添加
  const addTest = () => addTestVisible.value = true
  // 添加弹窗关闭按钮
  const addHandleClose = done => {
    if (addTestLoading.value) return ElMessage.warning('正在添加，请稍后！')
    if (!isEdit.value) return done()
    done()
    // ElMessageBox.confirm('确认关闭弹窗吗? 所有未保存数据均会消失！')
    //   .then(() => {
    //     done()
    //     resetObj(addParams)
    //   }, err => {})
  }
  // 重置添加表单
  const resetAddForm = formEl => {
    console.log(formEl);
    if (!formEl) return
    formEl.resetFields()
  }
  // 添加/编辑 按钮
  const submitAddForm = formEl => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        if (addParams.qualifiedScore > addParams.totalScore) return ElMessage.error("合格分数不能大于总分数！")
        if (addParams.difficulty <= 0) return ElMessage.error("请选择考试难度")
        if (addParams.startTime !== '' && addParams.endTime !== '' && (new Date(addParams.endTime).getTime() < new Date(addParams.startTime).getTime())) return ElMessage.error("考试停考时间不能早于考试开考时间！")
        addTestLoading.value = true
        if (!isEdit.value) addProductFunc(addParams)
        else editProductFunc(addParams)
      }
    })
  }
  // 新增考试
  function addProductFunc(addParams) {
    addEpaper(addParams)
      .then(res => {
        console.log("addEpaper: ", res);
        addTestLoading.value = false
        addTestVisible.value = false
        ElMessage.success('添加成功')
        resetAddForm(addRuleFormRef.value)
        searchList()
      }, err => addTestLoading.value = false
    )
  }
  // 保存考试
  function editProductFunc(addParams) {
    editEpaper(addParams)
      .then(res => {
        console.log("editEpaper: ", res);
        addTestLoading.value = false
        addTestVisible.value = false
        ElMessage.success('编辑成功')
        resetAddForm(addRuleFormRef.value)
        searchList()
      }, err => addTestLoading.value = false
    )
  }
  // 编辑
  const editTest = row => getEpaperDetailFunc(row.id)
  // 获取详情
  function getEpaperDetailFunc(id) {
    getEpaperDetail(id)
      .then(res => {
        console.log('getEpaperDetail: ', res);
        if (res.code === 200) {
          addParams.id = res.data.id
          addParams.difficulty = res.data.difficulty
          addParams.startTime = res.data.startTime
          addParams.endTime = res.data.endTime
          addParams.duration = res.data.duration
          addParams.etype = res.data.etype
          addParams.level = res.data.level
          addParams.name = res.data.name
          addParams.qualifiedScore = res.data.qualifiedScore
          addParams.totalScore = res.data.totalScore
          addTestVisible.value = true
          isEdit.value = true
        }
      })
  }
  // 删除
  const deleteTest = row => {
    proxy.$modal.confirm(`确认删除试卷《${row.name}》吗？`)
      .then(() => {
        deleteEpaper(row.id)
          .then(res => {
            console.log('deleteEpaper: ', res);
            if (res.code === 200) proxy.$modal.msgSuccess("删除成功")
            searchList()
          })
      })
  }



  // 试卷ID
  let epaperId = ref('')


  
  // 原始的人员tree所有数据（接口返回）
  let originalPersonTreeData = ref([])
  // 处理好的人员tree所有数据
  let personTreeData = ref([])
  // 人员tree选中的数据
  let personTreeCheckedData = ref([])
  // 旧的数据（删除人员tree选中的数据使用）
  let oldPersonTreeCheckedData = []
  // 人员tree默认格式props
  const personTreeDefaultProps = {
    children: 'children',
    label: 'name',
    disabled: 'disabled',
  }
  // 添加人员弹出框是否显示
  let setTestPersonVisible = ref(false)
  // 添加人员loading
  let setTestPersonLoading = ref(false)
  // 是否编辑人员
  let isEditPerson = ref(false)
  // 添加人员弹出框 ref
  let refPersonTree = ref(null)
  // // tree 题目类型
  // let paramsLevel = ref(0)
  // 获取人员tree数据函数
  function getDeptUsersListFunc() {
    personTreeData.value = []
    personTreeCheckedData.value = []
    return new Promise((resolve, reject) => {
      getDeptUsersList()
        .then(res => {
          console.log('getDeptUsersList: ', res);
          originalPersonTreeData.value = res.data
          personTreeData.value = proxy.handleTree(res.data, "id");
          isEditPerson.value = true
          resolve('')
        }, err => reject(''))
    })
  }
  // 获取已经添加的参考人员
  function getEpaperUserListFunc() {
    getEpaperUserList({epaperId: epaperId.value})
      .then(res => {
        console.log('getEpaperUserList: ', res);
        if (res.code === 200) {
          oldPersonTreeCheckedData = res.data
          res.data.forEach(item => {
            originalPersonTreeData.value.forEach(i => {
              if (i.type === 1 && i.dataId === item) refPersonTree.value.setChecked(i.id, true, false)
            })
          })
        }
      })
  }
  // 删除已经添加的参考人员 （添加前先删除）
  function deleteEpaperUserFunc() {
    return new Promise((resolve, reject) => {
      setTestPersonLoading.value = true
      deleteEpaperUser({epaperId: epaperId.value, userIds: oldPersonTreeCheckedData})
        .then(res => {
          console.log('deleteEpaperUser: ', res);
          resolve('')
        }, err => {
          setTestPersonLoading.value = false
          reject('')
        })
    })
  }
  // 人员管理按钮
  const setTestPerson = async item => {
    await getDeptUsersListFunc()
    epaperId.value = item.id
    getEpaperUserListFunc()
    setTestPersonVisible.value = true
  }
  // 添加人员弹窗关闭事件
  const setTestPersonHandleClose = done => {
    if (setTestPersonLoading.value) return ElMessage.warning('正在添加，请稍后！')
    if (!isEditPerson.value) return done()
    done()
    // ElMessageBox.confirm('确认关闭弹窗吗? 所有未保存数据均会消失！')
    //   .then(() => {
    //     done()
    //     resetObj(addParams)
    //   }, err => {})
  }
  // 左侧树checked或者右侧删除情况下 整理personTreeCheckedData数据
  function sortPersonTreeCheckedData() {
    // 所有选中数据处理 只要最下层
    let checkedNodesArr = refPersonTree.value.getCheckedNodes()
    // 每次点击都是空
    personTreeCheckedData.value = []
    checkedNodesArr.forEach(item => {
      if (item.type === 1) {
        checkedNodesArr.forEach(i => {
          if (item.parentId === i.id) item.parentName = i.name
        })
        personTreeCheckedData.value.push(item)
      }
    })
  }
  // tree 选择考试人员函数
  const handleCheckPersonTreeChange = ( data, checked, indeterminate ) => {
    console.log('所有选中key，包括父级 - getCheckedKeys: ',refPersonTree.value.getCheckedKeys());
    console.log('所有选中数据对象，包括父级 - getCheckedNodes: ',refPersonTree.value.getCheckedNodes());
    sortPersonTreeCheckedData()
  }
  // 删除本地回显考试人员
  const deleteTestPerson = (item) => {
    refPersonTree.value.setChecked(item.id, false, false)
    sortPersonTreeCheckedData()
  }
  // 保存考试人员
  async function addEpaperUserFunc() {
    let userIdArr = []
    personTreeCheckedData.value.forEach(item => userIdArr.push(item.dataId))
    let params = {
      epaperId: epaperId.value,
      userId: userIdArr
    }
    if (oldPersonTreeCheckedData.length > 0) await deleteEpaperUserFunc()
    setTestPersonLoading.value = true
    addEpaperUser(params)
      .then(res => {
        console.log('addEpaperUser: ', res);
        setTestPersonLoading.value = false
        if (res.code === 200) {
          ElMessage.success('参考人员保存成功！')
          isEditPerson.value = false
          setTestPersonVisible.value = false
        }
      }, err => setTestPersonLoading.value = false )
  }



  // 点击题目管理的试卷信息
  let testObj = ref({})
  // 原始的试题tree所有数据（接口返回）
  let originalSubjectTreeData = ref([])
  // 处理好的试题tree所有数据
  let subjectTreeData = ref([])
  // 试题tree选中的数据
  let subjectTreeCheckedData = ref([])
  // 旧的数据（删除试题tree选中的数据使用）
  let oldSubjectTreeCheckedData = []
  // 试题tree默认格式props
  const subjectTreeDefaultProps = {
    children: 'children',
    label: 'title',
    disabled: 'disabled',
  }
  // 添加试题弹出框是否显示
  let setTestSubjectVisible = ref(false)
  // 添加试题loading
  let setTestSubjectLoading = ref(false)
  // 是否编辑试题
  let isEditSubject = ref(false)
  // 添加试题弹出框 ref
  let refSubjectTree = ref(null)
  // tree 题目类型
  let paramsLevel = ref(0)
  // 获取试题tree数据函数
  function getAllSectionQuestionListFunc() {
    subjectTreeData.value = []
    subjectTreeCheckedData.value = []
    return new Promise((resolve, reject) => {
      getAllSectionQuestionList({ level: paramsLevel.value })
        .then(res => {
          console.log('getAllSectionQuestionList: ', res);
          originalSubjectTreeData.value = res.data
          subjectTreeData.value = proxy.handleTree(res.data, "id");
          isEditSubject.value = true
          resolve('')
        }, err => reject(''))
    })
  }
  // 获取已经添加的参考试题
  function getEpaperQuestionListFunc() {
    getEpaperQuestionList({epaperId: epaperId.value})
      .then(res => {
        console.log('getEpaperQuestionList: ', res);
        if (res.code === 200) {
          oldSubjectTreeCheckedData = res.data
          res.data.forEach(item => {
            originalSubjectTreeData.value.forEach(i => {
              if (i.type === 1 && i.dataId === item) refSubjectTree.value.setChecked(i.id, true, false)
            })
          })
        }
      })
  }
  // 删除已经添加的参考试题 （添加前先删除）
  function deleteEpaperQuestionFunc() {
    return new Promise((resolve, reject) => {
      setTestSubjectLoading.value = true
      deleteEpaperQuestion({epaperId: epaperId.value, quesionIds: oldSubjectTreeCheckedData})
        .then(res => {
          console.log('deleteEpaperQuestion: ', res);
          resolve('')
        }, err => {
          setTestSubjectLoading.value = false
          reject('')
        })
    })
  }
  // 试题管理按钮
  const setTestSubject = async item => {
    testObj.value = item
    await getAllSectionQuestionListFunc()
    epaperId.value = item.id
    paramsLevel.value = item.level
    getEpaperQuestionListFunc()
    setTestSubjectVisible.value = true
  }
  // 添加试题弹窗关闭事件
  const setTestSubjectHandleClose = done => {
    if (setTestSubjectLoading.value) return ElMessage.warning('正在添加，请稍后！')
    if (!isEditSubject.value) return done()
    done()
    // ElMessageBox.confirm('确认关闭弹窗吗? 所有未保存数据均会消失！')
    //   .then(() => {
    //     done()
    //     resetObj(addParams)
    //   }, err => {})
  }
  // 左侧树checked或者右侧删除情况下 整理subjectTreeCheckedData数据
  function sortSubjectTreeCheckedData() {
    // 所有选中数据处理 只要最下层
    let checkedNodesArr = refSubjectTree.value.getCheckedNodes()
    // 每次点击都是空
    subjectTreeCheckedData.value = []
    checkedNodesArr.forEach(item => {
      if (item.type === 1) {
        checkedNodesArr.forEach(i => {
          if (item.parentId === i.id) item.parentName = i.name
        })
        subjectTreeCheckedData.value.push(item)
      }
    })
  }
  // tree 选择考试试题函数
  const handleCheckSubjectTreeChange = ( data, checked, indeterminate ) => {
    console.log('所有选中key，包括父级 - getCheckedKeys: ',refSubjectTree.value.getCheckedKeys());
    console.log('所有选中数据对象，包括父级 - getCheckedNodes: ',refSubjectTree.value.getCheckedNodes());
    sortSubjectTreeCheckedData()
  }
  // 删除本地回显考试试题
  const deleteTestSubject = (item) => {
    refSubjectTree.value.setChecked(item.id, false, false)
    sortSubjectTreeCheckedData()
  }
  // 已选题目总分计算属性
  let subjectTreeCheckedDataAllScore = computed(() => {
    let score = 0
    subjectTreeCheckedData.value.forEach( item => score += item.score )
    return score
  })
  // 保存考试试题
  async function addEpaperQuestionFunc() {
    if (subjectTreeCheckedDataAllScore.value > testObj.value.totalScore) return ElMessage.error(`所选试题总分${subjectTreeCheckedDataAllScore.value}分大于试卷所设置分数${testObj.value.totalScore}分，请减少试题数量或者修改试卷分数！`)
    else if (subjectTreeCheckedDataAllScore.value < testObj.value.totalScore) return ElMessage.error(`所选试题总分${subjectTreeCheckedDataAllScore.value}分小于试卷所设置分数${testObj.value.totalScore}分，请增加试题数量或者修改试卷分数！`)
    let quesionIdsArr = []
    subjectTreeCheckedData.value.forEach(item => quesionIdsArr.push(item.dataId))
    let params = {
      epaperId: epaperId.value,
      quesionIds: quesionIdsArr
    }
    if (oldSubjectTreeCheckedData.length > 0) await deleteEpaperQuestionFunc()
    setTestSubjectLoading.value = true
    addEpaperQuestion(params)
      .then(res => {
        console.log('addEpaperQuestion: ', res);
        setTestSubjectLoading.value = false
        if (res.code === 200) {
          ElMessage.success('参考试题保存成功！')
          isEditSubject.value = false
          setTestSubjectVisible.value = false
        }
      }, err => setTestSubjectLoading.value = false )

  }






















  // 根据id返回指定的的lebel
  const returnTargetOptionsLabel = (key, target) => {
    let str = ''
    target.filter(item => { if (item.value === key) str = item.label })
    return str
  }

  // 快速清空对象key值
  const resetObj = target => Object.keys(target).forEach( key => target[key] = '')
  
</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.control-bar{
  .search-input{
    margin: 0;
  }
  .control-right{
    text-align: right;
  }
}

// 添加试卷弹窗
.add-form{
  .name{
    width: 40%;
  }
  ::v-deep(.el-form-item--default) {
    .el-form-item__content{
      line-height: 0;
    }
  }
  .button-box{
    margin: 30px 0 0 90px;
  }
}

// tree 弹窗设置
.add-person{

  ::v-deep(.el-row){
    justify-content: space-evenly;
    min-height: 46vh;
    max-height: 60vh;
    overflow-y: auto;
    .el-col{
      padding: 18px;
      border: solid 1px #e1e1e1;
      border-radius: 8px;
    }
  }

  .button-box{
    padding: 0 10px;
    margin: 20px 0 0;
    display: flex;
    justify-content: end;
  }

}

.tree-content {

  // tree默认样式修改
  ::v-deep(.el-tree) {

    >.el-tree-node{
      >.el-tree-node__content{
        >.el-tree-node__label{
          // position: relative;
          // padding: 0 0 0 20px;
          color: #333;
          font-size: 16px;
        }
        // >.el-tree-node__label::after{
        //   content: '';
        //   background-image: url('http://localhost/src/assets/logo/police.png');
        //   background-size: 10px;
        //   background-repeat: no-repeat;
        //   width: 10px;
        //   height: 10px;
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        // }
      }
      >.el-tree-node__children{
        >.el-tree-node{
          >.el-tree-node__content{
            >.el-tree-node__label{
              color: #555;
              font-size: 15px;
            }
          }
          >.el-tree-node__children{
            >.el-tree-node{
              >.el-tree-node__content{
                >.el-tree-node__label{
                  color: #666;
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
    }
    // 边线
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    .el-icon-caret-right:before {
      content: "\e723";
      font-size: 16px;
      color: #409eff;
    }
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before{
      content: "\e722";
      font-size: 16px;
      color: #409eff;
    }
    overflow-y:auto;
    .el-tree > .el-tree-node:after {
      border-top: none;
    }
    .el-tree-node {
      position: relative;
      padding-left: 16px;
    }
    //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
    .el-tree-node__expand-icon.is-leaf {
      display: none;
    }
    .el-tree-node__children {
      padding-left: 16px;
    }
    .el-tree-node :last-child:before {
      height: 38px;
    }
    .el-tree > .el-tree-node:before {
      border-left: none;
    }
    .el-tree > .el-tree-node:after {
      border-top: none;
    }
    .el-tree-node:before {
      content: '';
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }
    .el-tree-node:after {
      content: '';
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
    }
    .el-tree-node:before {
      border-left: 1px dashed #409eff;
      bottom: 0px;
      height: 100%;
      top: -26px;
      width: 1px;
    }
    .el-tree-node:after {
      border-top: 1px dashed #409eff;
      height: 20px;
      top: 12px;
      width: 18px;
    }
    .el-tree .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    .el-tree .el-icon-caret-right:before {
      content: "\e723";
      font-size: 16px;
      color: #409eff;
      position: absolute;
      left :-20px;
      top: -8px;
    }
    .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before{
      content: "\e722";
      font-size: 16px;
      color: #409eff;
      position: absolute;
      left: -20px;
      top: -8px;
    }
    .el-tree-node__content>.el-tree-node__expand-icon {
      padding: 0;
    }
  }

}

.checked-content{
  .title{
    display: flex;
    justify-content: space-between;
    padding: 0 0 10px 0;
    font-size: 16px;
    color: #333;
    line-height: 30px;
    border-bottom: solid 1px #e1e1e1;
  }
  .checked-list{
    margin: 12px 12px 0 0;
    line-height: 26px;
    font-size: 15px;
    .checked{
      display: flex;
      align-items: center;
      justify-content: space-between;
      ::v-deep(.el-icon){
        color: #F56C6C;
        cursor: pointer;
      }
    }
  }
}
</style>

