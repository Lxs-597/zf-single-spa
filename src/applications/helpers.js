export const NOT_LOADED = 'NOT_LOADED' // 初始状态
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE' // 加载资源
export const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED' // 还没调用bootstrap方法
export const BOOTSTRAPPING = 'BOOTSTRAPPING' // 加载中
export const NOT_MOUNTED = 'NOT_BOOTSTRAPPED' // 还未挂载
export const MOUNTING = 'MOUNTING' // 挂载中
export const MOUNTED = 'MOUNTED' // 挂载完成
export const UPDATING = 'UPDATING' // 更新中
export const UNMOUNTING = 'UNMOUNTING' // 解除挂载中
export const UNLOADING = 'UNLOADING' // 卸载中
export const LOAD_ERR = 'LOAD_ERR'
export const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN'

// 应用是否激活
export const isActive = app => app.status === MOUNTED

// 应用是否要被激活
export const shouldBeActive = app => app.activeWhen(window.location)