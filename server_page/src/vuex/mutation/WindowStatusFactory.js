/**
 * window 构造工厂
 */

export default class WindowStatusFactory {
  /**
   * 根据 windowName 构造 window 状态
   * @param windowName
   */
  constructor (windowName) {
    /**
     * 加载中
     * @type {string}
     */
    this.LOADING = `${windowName}_LOADING`

    /**
     * 加载完成
     * @type {string}
     */
    this.LOADED = `${windowName}_LOADED`

    /**
     * 显示
     * @type {string}
     */
    this.SHOW = `${windowName}_SHOW`

    /**
     * 隐藏
     * @type {string}
     */
    this.HIDE = `${windowName}_HIDE`
  }
}
