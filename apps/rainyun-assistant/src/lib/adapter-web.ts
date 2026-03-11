export class WebAdapter implements IPlatformAdapter {
  async sum(numbers: number[]): Promise<number> {
    // 纯 web 环境下的实现
    return numbers.reduce((a, b) => a + b, 0)
  }
}
