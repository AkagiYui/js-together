import { platformBridge } from "./bridge"

export function usePlatform(): IPlatformAdapter {
  return platformBridge
}
