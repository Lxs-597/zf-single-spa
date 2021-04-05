import { LOADING_SOURCE_CODE, NOT_BOOTSTRAPPED } from "../applications/helpers"

export const toLoadPromise = async app => {
  if (app.loadPromise) return app.loadPromise

  return (app.loadPromise = Promise.resolve().then(async () => {
    app.status = LOADING_SOURCE_CODE

    const { mount, bootstrap, unmount } = await app.loadApp(app.customProps)

    app.status = NOT_BOOTSTRAPPED
    app.mount = pipeAsyncFunctions(mount)
    app.unmount = pipeAsyncFunctions(unmount)
    app.bootstrap = pipeAsyncFunctions(bootstrap)
    delete app.loadPromise

    return app
  }))
}

function pipeAsyncFunctions(fns) {
  fns = Array.isArray(fns) ? fns : [fns]

  return props => fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve())
}
