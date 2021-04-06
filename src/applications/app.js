import { reroute } from "../navigations/reroute"
import { started } from "../start"
import { shouldBeActive, NOT_LOADED, SKIP_BECAUSE_BROKEN, LOADING_SOURCE_CODE, NOT_BOOTSTRAPPED, BOOTSTRAPPING, NOT_MOUNTED, MOUNTED } from "./helpers"

const apps = []

export const registerApplication = (appName, loadApp, activeWhen, customProps) => {
  apps.push({
    status: NOT_LOADED,
    name: appName,
    loadApp,
    activeWhen,
    customProps
  })

  reroute()
}

export const getAppChanges = () => {
  const appToUnmount = [] // 要卸载的app
  const appToLoad = [] // 要加载的app
  const appToMount = [] // 要挂载的app

  apps.forEach(app => {
    const status = app.status
    const appShouldBeActive = shouldBeActive(app)

    switch (status) {
      case NOT_LOADED:
      case LOADING_SOURCE_CODE: {
        if (appShouldBeActive) {
          appToLoad.push(app)
        }
        break
      }

      case NOT_BOOTSTRAPPED:
      case BOOTSTRAPPING:
      case NOT_MOUNTED: {
        if (appShouldBeActive) {
          appToMount.push(app)
        }
        break
      }

      case MOUNTED: {
        if (!appShouldBeActive) {
          appToUnmount.push(app)
        }
        break
      }
    }
  })

  return {
    appToLoad,
    appToMount,
    appToUnmount,
  }
}