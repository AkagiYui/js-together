export {}
declare global {
  interface Window {
    __TAURI__: any
    go: any
    myAPI: any
    Capacitor: any
  }
}
