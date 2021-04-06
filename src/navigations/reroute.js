import { getAppChanges } from "../applications/app"
import { toBootstrapPromise } from "../lifecycles/bootstrap"
import { toLoadPromise } from "../lifecycles/load"
import { toMountPromise } from "../lifecycles/mount"
import { toUnmountPromise } from "../lifecycles/unmount"
import { started } from "../start"

import './events'

// 核心应用处理方法
export const reroute = () => {
  const { appToLoad, appToMount, appToUnmount } = getAppChanges()

  if (started) {
    return performAppChanges()
  } else {
    return loadApps()
  }

  // 预加载应用
  async function loadApps() {
    const loadApps = await Promise.all(appToLoad.map(toLoadPromise))
  }

  // 挂载应用
  async function performAppChanges() {
    // 卸载不需要的应用
    let unmountApps = Promise.all(appToUnmount.map(toUnmountPromise))
    // 加载需要的应用
    appToLoad.map(async app => {
      app = await toLoadPromise(app)
      app = await toBootstrapPromise(app)

      return toMountPromise(app)
    })

    appToMount.map(async app => {
      app = await toBootstrapPromise(app)

      return toMountPromise(app)
    })
  }
}