// ==UserScript==
// @name         【雨云】雨云助手连接器
// @version      0.1.0
// @description  为雨云助手提供 API 代理，避免跨域问题，确保 API 访问正常。注意，
// @match        https://rya.akagiyui.com/*
// @match        http://localhost:[54]173/assistant*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.v2.rainyun.com
// @connect      cn-nb1.rains3.com
// @namespace    https://github.com/AkagiYui/UserScript
// @supportURL   https://github.com/AkagiYui/UserScript/issues
// @homepage     https://github.com/AkagiYui
// @author       AkagiYui
// @license      MIT
// ==/UserScript==

;(function () {
  "use strict"

  function beforeRequest(details) {
    return details
  }

  // 代理 XMLHttpRequest
  class ProxyXHR extends XMLHttpRequest {
    constructor() {
      super()

      // 初始化请求信息
      this._requestInfo = {
        method: null,
        url: null,
        headers: {},
        timeout: 0,
        withCredentials: false,
        responseType: "",
        readyState: 0,
        onreadystatechange: null,
      }
      this._responseHeaders = {}

      // 初始化拦截器
      this._initializeInterceptors()
    }

    // 初始化属性拦截器
    _initializeInterceptors() {
      // 定义需要拦截的属性
      const interceptedProps = {
        timeout: 0,
        withCredentials: false,
        responseType: "",
        onreadystatechange: null,
      }

      // 为每个属性创建拦截器
      for (const [prop, defaultValue] of Object.entries(interceptedProps)) {
        Object.defineProperty(this, prop, {
          get: () => this._requestInfo[prop],
          set: (value) => {
            this._requestInfo[prop] = value
          },
        })
      }

      // 特殊处理 readyState
      Object.defineProperty(this, "readyState", {
        get: () => this._requestInfo.readyState,
      })
    }

    // 发送代理请求
    _sendProxyRequest(data) {
      // 设置发送状态
      this._setReadyState(2)

      const details = beforeRequest({
        method: this._requestInfo.method,
        url: this._requestInfo.url,
        headers: this._requestInfo.headers,
        data: data,
        timeout: this._requestInfo.timeout,
        responseType: this._requestInfo.responseType || "json",
        withCredentials: this._requestInfo.withCredentials,
        onload: this._handleResponse.bind(this),
        onerror: this._handleError.bind(this),
        ontimeout: this._handleTimeout.bind(this),
      })

      console.debug(`[${new Date().toLocaleString()}][${details.method}] ${details.url}`)
      GM_xmlhttpRequest(details)
    }

    // 处理响应
    _handleResponse(response) {
      Object.defineProperties(this, {
        status: { value: response.status },
        statusText: { value: response.statusText },
        responseText: { value: response.responseText },
        response: {
          value: this._requestInfo.responseType === "json" ? JSON.parse(response.responseText) : response.response,
        },
      })

      // 设置响应头
      this._responseHeaders = response.responseHeaders

      this._setReadyState(4)
      this.dispatchEvent(new Event("load"))
      if (typeof this.onload === "function") {
        this.onload()
      }
    }

    // 处理错误
    _handleError(error) {
      this._setReadyState(4)
      this.dispatchEvent(new Event("error"))
      if (typeof this.onerror === "function") {
        this.onerror(error)
      }
    }

    // 处理超时
    _handleTimeout() {
      this._setReadyState(4)
      this.dispatchEvent(new Event("timeout"))
      if (typeof this.ontimeout === "function") {
        this.ontimeout()
      }
    }

    // 设置 readyState 并触发事件
    _setReadyState(state) {
      this._requestInfo.readyState = state
      if (typeof this.onreadystatechange === "function") {
        this.onreadystatechange()
      }
    }

    // 重写 open 方法
    open(...args) {
      const [method, url] = args
      this._requestInfo.method = method
      this._requestInfo.url = url

      this._setReadyState(1)
    }

    // 重写 setRequestHeader 方法
    setRequestHeader(header, value) {
      this._requestInfo.headers[header] = value
    }

    // 重写 send 方法
    send(data) {
      this._sendProxyRequest(data)
    }

    // 重写 getAllResponseHeaders 方法
    getAllResponseHeaders() {
      return this._responseHeaders
    }
  }

  function health() {
    return "ok"
  }

  if (unsafeWindow.rya) {
    unsafeWindow.XMLHttpRequest = ProxyXHR
    unsafeWindow.proxyHealth = health
  }

  function handleImage(img) {
    const originalSrc = img.src
    if (!originalSrc.includes("rains3.com/rainyun-public/images")) return

    console.log("[IMAGE]", originalSrc)

    GM_xmlhttpRequest({
      method: "GET",
      url: originalSrc,
      headers: {
        Referer: "https://app.rainyun.com/",
      },
      responseType: "blob",
      onload: function (response) {
        console.log("[IMG PROXY]", response)
        img.src = URL.createObjectURL(response.response)
      },
    })
  }

  document.querySelectorAll("img").forEach(handleImage)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "IMG") {
          handleImage(node)
        }
      })
    })
  })
  observer.observe(unsafeWindow.document.body, {
    childList: true,
    subtree: true,
  })
})()
