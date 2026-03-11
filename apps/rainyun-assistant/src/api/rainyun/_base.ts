import { buildRequester } from "../builder"

const isDev = import.meta.env.DEV
const API_BASE_URL = false ? "/api/rainyun" : import.meta.env.VITE_RAINYUN_PROXY_BASE_URL

export const http = buildRequester<RYResponse<any>>({
  baseUrl: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: false,
  onBeforeRequest(config) {
    const token = localStorage.getItem("rya-apiKey")
    if (token) {
      if (!config.headers) {
        config.headers = {}
      }
      config.headers["X-API-KEY"] = token.replaceAll('"', "")
      console.log(config.headers)
    }
    return config
  },
})
