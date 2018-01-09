import XHRStatusFactory from './XHRStatusFactory'

export default class GroupFactory {
  /**
   * 创建一个功能点的所有窗口和请求
   * @param groupName
   * @param windowNames
   * @param xhrNames
   */
  constructor (groupName, eventNames, xhrNames) {
    this.events = {}

    this.xhrs = {}

    eventNames.forEach(eventName => {
      /**
       * TODO 不需要窗口监听,暂定事件监听
       */
      // this.windows[winName] = new WindowStatusFactory(`${groupName}_${winName}`)
      this.events[eventName] = `${groupName}_EVENT_${eventName}`
    })

    xhrNames.forEach(xhrName => {
      this.xhrs[xhrName] = new XHRStatusFactory(`${groupName}_${xhrName}`)
    })
  }
}
