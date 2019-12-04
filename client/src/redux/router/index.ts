import Router from 'next/router'

export function addRouteCompleteEvent(fx: (url) => void) {
  onRouteCompleteEvents.push(fx)
}

const onRouteCompleteEvents = []

const onRouteChangeComplete = (url) => {
  onRouteCompleteEvents.forEach(fx => fx(url))
}

Router.events.on(`onRouteChangeComplete`, onRouteChangeComplete)
