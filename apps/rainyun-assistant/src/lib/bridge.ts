import { WailsAdapter } from "./adapter-wails"
import { WebAdapter } from "./adapter-web"

class PlatformBridge {
  private static instance: PlatformBridge
  private adapter: IPlatformAdapter

  private constructor() {
    this.adapter = this.createAdapter()
  }

  private createAdapter(): IPlatformAdapter {
    if (window.go) {
      return new WailsAdapter()
    }
    return new WebAdapter()
  }

  public static getInstance(): PlatformBridge {
    if (!PlatformBridge.instance) {
      PlatformBridge.instance = new PlatformBridge()
    }
    return PlatformBridge.instance
  }

  /**
   * 计算一组数字的和
   */
  public async sum(numbers: number[]): Promise<number> {
    try {
      return await this.adapter.sum(numbers)
    } catch (error) {
      console.error("Failed to calculate sum:", error)
      throw error
    }
  }
}
// 导出单例
export const platformBridge = PlatformBridge.getInstance()
export default platformBridge
