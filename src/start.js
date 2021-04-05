import { reroute } from "./navigations/reroute"

export let started = false

export const start = () => {
  started = true
  reroute() // 加载应用
}