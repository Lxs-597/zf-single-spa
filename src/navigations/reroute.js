import { getAppChanges } from "../applications/app"
import { toBootstrapPromise } from "../lifecycles/bootstrap"
import { toLoadPromise } from "../lifecycles/load"
import { toMountPromise } from "../lifecycles/mount"
import { toUnmountPromise } from "../lifecycles/unmount"
import { started } from "../start"

// 核心应用处理方法
export const reroute = () => {
  const { appToLoad, appToMount, appToUnmount } = getAppChanges()

  console.log(appToLoad, appToMount, appToUnmount)

  if (started) {
    console.log('嗲用start')
    return performAppChanges()
  } else {
    console.log('嗲用register')
    return loadApps()
    // reroute() // 加载应用
  }

  // 预加载应用
  async function loadApps() {
    const loadApps = await Promise.all(appToLoad.map(toLoadPromise))

    console.log(loadApps)
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