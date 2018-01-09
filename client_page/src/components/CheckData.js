const checkUtil = {
  // 不为空
  notNull: /.+/,
  // 不含空格
  notSpace: /^\S+$/,
  // 大于6位
  moreThan6: /.{6}/,
  // 小于20位
  moreThan20: /^.{0,20}$/,
  moreThan30: /^.{0,30}$/,
  // 只能为英文,数字,!#$&*.~@
  pwdReg: /^[A-Za-z0-9!@#$&*.]+$/,
  // month 1 - 31 的数字
  month: /^[1-9]$|^[1, 2][0-9]$|^3[0, 1]$/,
  // week 1- 7
  week: /^[1-7]$/,
  // email
  email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
  // phone
  phone: /^1+\d{10}$/
}

export default (checkString, ...value) => {
  checkString = checkString || ''
  let reArray = []
  value.forEach(checkKey => {
    let type = typeof checkKey
    switch (type) {
      case 'string':
        reArray.push(checkUtil[checkKey].test(checkString))
        break
      case 'function':
        reArray.push(checkKey(checkString))
        break
      default:
        reArray.push(false)
    }
  })
  return reArray
}
