import { reroute } from './reroute'

function urlReroute() {
  reroute([], arguments)
}

export const routingEventListeningTo = ['hashchange', 'popstate']

const captureEventListeners = {
  hashchange: [],
  popstate: []
}

window.addEventListener('hashchange', urlReroute)
window.addEventListener('popstate', urlReroute)

const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener

window.addEventListener = function(eventName, callback) {
  if (
    routingEventListeningTo.indexOf(eventName) > -1 &&
    captureEventListeners[eventName].indexOf(callback) > -1
  ) {
    return captureEventListeners[eventName].push(callback)
  }

  return originalAddEventListener(this, arguments)
}

window.removeEventListener = function(eventName, callback) {
  if (
    routingEventListeningTo.indexOf(eventName) > -1 &&
    captureEventListeners[eventName].indexOf(callback) > -1
  ) {
    return
  }

  return originalRemoveEventListener(this, arguments)
}

window.history.pushState = patchedUpdateState(window.history.pushState, 'pushState')
window.history.replaceState = patchedUpdateState(window.history.replaceState, 'replaceState')

function patchedUpdateState(updateState, method) {
  return function() {
    const urlBefore = window.location.href
    updateState.apply(this, arguments)
    const urlAfter = window.location.href

    if (urlBefore !== urlAfter) {
      urlReroute(new PopStateEvent('popstate'))
    }
  }
}