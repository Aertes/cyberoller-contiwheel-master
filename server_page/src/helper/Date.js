let today = new Date()

export const getSevenDay = () => {
  let reDate = new Date().setDate(today.getDate() - 7)
  return reDate
}
export const getLastMonth = () => {
  return [
    new Date(today.getFullYear(), today.getMonth() - 1, 1),
    new Date(today.getFullYear(), today.getMonth(), -1)
  ]
}

export const toDate = str => {
  if (/^\d{4}\d{2}\d{2}$/.test(str)) {
    str += '000000'
  }
  if (/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/.test(str)) {
    let v = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(str)
    v.shift()
    return new Date(v[0], v[1] - 1, v[2], v[3], v[4], v[5])
  }
  return new Date()
}
