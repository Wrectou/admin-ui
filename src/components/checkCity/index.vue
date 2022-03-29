<template>
  <el-dialog
    v-model="dialogVisible"
    title="请选择城市"
    width="40%"
    :show-close="false"
  >
    <div class="city-container">
      <!-- 全国 -->
      <div v-for="country in regionCheckBoxListData" :key="country.VALUE">
        <label class="el-checkbox el-checkbox--default" @click="checkCountry">
          <span :class="['el-checkbox__input', compCheckCityArr.length <= 0 ? '' : compCheckCityArr.length === cityNum ? 'is-checked' : 'is-indeterminate']" aria-checked="mixed" tabindex="0" role="checkbox">
            <span class="el-checkbox__inner"></span>
          </span>
          <span class="el-checkbox__label">{{country.TITLE}}</span>
        </label>
        <!-- 地区 -->
        <div class="region-box" v-for="region in country.CHILDREN" :key="region.VALUE">
          <span class="region">{{region.TITLE}}</span>
          <!-- 省份 -->
          <span class="province-box" v-for="province in region.CHILDREN" :key="province.VALUE">
            <label class="province el-checkbox el-checkbox--default" @click="checkProvince(province)">
              <span :class="provinceDomShow(province)" aria-checked="false">
                <span class="el-checkbox__inner"></span>
              </span>
              <span class="el-checkbox__label">{{province.TITLE}}</span>
            </label>
            <!-- 城市 -->
            <div class="city-box">
              <span v-for="city in province.CHILDREN" :key="city.VALUE">
                <label class="city el-checkbox el-checkbox--default" @click="checkCity(city)">
                  <span :class="['el-checkbox__input', city.isCkecked ? 'is-checked' : '']" aria-checked="false">
                    <span class="el-checkbox__inner"></span>
                  </span>
                  <span class="el-checkbox__label">{{city.TITLE}}</span>
                </label>
              </span>
            </div>
          </span>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="checkCityHandle">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { regionCheckBoxList } from "@/utils/area-data"
  import { deepClone } from "@/utils"

  const props = defineProps({
    dialogVisible:{
      type: Boolean,
      default: false
    },
    checkCityArr:{
      type: Array,
      default: []
    },
  })

  const emit = defineEmits(['closeCheckCity', 'getCityData'])

  defineExpose({
    deleteItem,
  })

  // 定义全国数据
  const regionCheckBoxListData = reactive(regionCheckBoxList)

  let cityNum = ref(0)
  // 勾选的城市数据
  let compCheckCityArr = ref([])

  // 初始化数据函数
  function initData() {
    regionCheckBoxListData[0].isCkecked = false
    findAllCity(regionCheckBoxListData[0])
  }
  initData()
  function findAllCity(origin) {
    if (!origin.CHILDREN) return
    origin.CHILDREN.forEach(item => {
      if (item.TYPE !== 'area' && item.TYPE !== 'province') {
        cityNum.value ++
        item.isCkecked = false
        item.areaLevel = 2
        item.areaCode = item.VALUE
      }
      if (item.TYPE === 'province') {
        item.isCkecked = false
        item.areaLevel = 1
        item.areaCode = item.VALUE
      }
      if (item.CHILDREN) findAllCity(item)
    })
  }

  // 如果传入了数据
  function initPropsData() {
    compCheckCityArr.value = props.checkCityArr
    checkCityHandle()
  }
  initPropsData()

  // 全国点击
  function checkCountry(isPush = true) {
    if (regionCheckBoxListData[0].isCkecked) {
      regionCheckBoxListData[0].isCkecked = false
      deepChildren(regionCheckBoxListData[0], false, isPush)
    } else {
      regionCheckBoxListData[0].isCkecked = true
      deepChildren(regionCheckBoxListData[0], true, isPush)
    }
  }

  // 各省点击
  function checkProvince(province, isPush = true) {
    if (province.isCkecked) {
      province.isCkecked = false
      deepChildren(province, false, isPush)
    } else {
      province.isCkecked = true
      deepChildren(province, true, isPush)
    }
  }

  // 各城市点击
  function checkCity(city, isPush = true) {
    if (city.isCkecked) {
      city.isCkecked = false
      if (isPush) {
        let index = compCheckCityArr.value.indexOf(city)
        compCheckCityArr.value.splice(index, 1)
      }
    } else {
      city.isCkecked = true
      if (isPush) compCheckCityArr.value.push(city)
    }
  }

  // 省份Dom显示计算数属性
  let provinceDomShow = computed((province) => {
    return (province) => {
      let str = ''
      let pCityNum = 0
      let provinceInfo = findProvince(province.VALUE)
      provinceInfo.CHILDREN.forEach(item => { if (item.isCkecked) pCityNum++ })
      if (provinceInfo.CHILDREN.length === pCityNum) str = 'el-checkbox__input is-checked'
      else str = 'el-checkbox__input is-indeterminate'
      if (pCityNum <= 0) str = 'el-checkbox__input'
      return str
    }
  })

  // 寻找具体省份
  function findProvince(code) {
    for (let item of regionCheckBoxListData[0].CHILDREN) {
      for (let p of item.CHILDREN) {
        if (p.VALUE === code) return p
      }
    }
  }

  // 全选/反选 递归函数
  function deepChildren(origin, type, isPush = true) {
    if (!origin.CHILDREN) return
    origin.CHILDREN.forEach(item => {
      if (item.TYPE !== 'area' && item.TYPE !== 'province') {
        if (type !== item.isCkecked) {
          item.isCkecked = type
          if (type) {
            if (isPush) compCheckCityArr.value.push(item)
          } else {
            if (isPush) {
              let index = compCheckCityArr.value.indexOf(item)
              compCheckCityArr.value.splice(index, 1)
            }
          }
        }
      }
      if (item.CHILDREN) deepChildren(item, type, isPush)
    })
  }

  // 删除数据操作
  function deleteItem(item) {
    if (item.TYPE === 'city') {
      checkCity(item)
      checkCityHandle()
    } else if (item.TYPE === 'province') {
      checkProvince(item)
      checkCityHandle()
    } else {
      checkCountry()
      checkCityHandle()
    }
  }

  // 取消按钮
  function close() {
    emit("closeCheckCity")
  }

  // 确定按钮
  function checkCityHandle(){
    let returnArr = []
    if (compCheckCityArr.value.length >= 338) {
      let obj = regionCheckBoxListData[0]
      obj.areaLevel = 0
      obj.areaCode = obj.VALUE
      checkCountry(false)
      returnArr.push(obj)
    } else {
      let provinceObj = {}
      for (let item of compCheckCityArr.value) {
        let cityProvinceCode = item.VALUE.substring(0, 2) + '0000'
        if (provinceObj[cityProvinceCode]) provinceObj[cityProvinceCode] ++
        else provinceObj[cityProvinceCode] = 1
      }
      for (let code in provinceObj) {
        let cityProvinceInfo = findProvince(code)
        if (provinceObj[code] === cityProvinceInfo.CHILDREN.length) {
          checkProvince(cityProvinceInfo, false)
          returnArr.push(cityProvinceInfo)
        } else {
          compCheckCityArr.value.forEach(item => {
            if (item.VALUE.substring(0, 2) + '0000' === code) {
              checkCity(item, false)
              returnArr.push(item)
            }
          })
        }
      }
    }
    emit("getCityData", returnArr)
  }

</script>

<style lang="scss" scoped>
.region-box{
  padding: 10px 10px 10px 0;
  line-height: 20px;
  .province-box{
    position: relative;
    display: inline-block;
    margin: 0 8px;
    padding: 0 6px;
    .city-box{
      position: absolute;
      display: none;
    }
  }
  .province-box:hover{
    box-shadow: 0px 0px 7px #e1e1e1;
    .city-box{
      display: inherit;
      background: #ffffff;
      z-index: 999;
      top: 32px;
      left: 0px;
      min-width: 22vw;
      box-shadow: 0px 0px 7px #e1e1e1;
      padding: 4px 8px;
      .city{
        margin: 0 10px 0 4px;
      }
    }
  }
}
</style>