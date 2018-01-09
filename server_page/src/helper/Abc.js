const numMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const get26 = count => count > 25 ? [...get26(parseInt(count / 26)), count % 26] : [count]
class Abc {
  constructor () {
    this.count = 0
  }
  getA () {
    let reValue = []
    let numList = get26(this.count)
    this.count++
    for (let i of numList) {
      reValue.push(numMap[i])
    }
    return reValue.join('')
  }
}

export default Abc
