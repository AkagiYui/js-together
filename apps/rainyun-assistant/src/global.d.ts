export {}
declare global {
  interface Window {
    proxyHealth?: () => "ok"
    rya: true
  }
}
declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    title?: string
  }
}
