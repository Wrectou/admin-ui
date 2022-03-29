import cache from "@/plugins/cache"

export default key => {
  let enumKeyData = cache.session.getJSON('Enum')[key]
  let enumKeyArr = []
  for (let key in enumKeyData.list) {
    // 枚举返回number类型的key
    let obj = { value: Number(key), label: enumKeyData.list[key]}
    enumKeyArr.push(obj)
  }
  return enumKeyArr
}