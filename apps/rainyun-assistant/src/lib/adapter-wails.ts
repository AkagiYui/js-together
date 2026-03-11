export class WailsAdapter implements IPlatformAdapter {
  async sum(numbers: number[]): Promise<number> {
    return await window.go.main.Sum(numbers)
  }
}
