import { MOUNTED, NOT_MOUNTED, UNMOUNTING } from "../applications/helpers"

export const toUnmountPromise = async app => {
  // 当前应用没有挂载
  if (app.status !== MOUNTED) return app

  app.status = UNMOUNTING
  await app.unmount(app.customProps)
  app.status = NOT_MOUNTED

  return app
}
