/**
 * 请求状态构造工厂
 */
export default class XHRStatusFactory {
  /**
   * 根据 xhrName 构造 XHR 状态
   * @param xhrName
   */
  constructor (xhrName) {
    /**
     * 开始请求
     * @type {string}
     */
    this.START = `${xhrName}_START`

    /**
     * 请求成功
     * @type {string}
     */
    this.SUCCESS = `${xhrName}_SUCCESS`

    /**
     * 请求失败
     * @type {string}
     */
    this.FAILURE = `${xhrName}_FAILURE`
  }
}
