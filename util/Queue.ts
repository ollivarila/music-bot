export default class Queue<T> {
  private items: T[] = []

  constructor() {}

  public enqueue(item: T): void {
    this.items.push(item)
  }

  public isEmpty(): boolean {
    return this.items.length === 0
  }

  public dequeue(): T | undefined {
    return this.items.shift()
  }

  public clear(): void {
    this.items = []
  }

  public getQueue(): T[] {
    return [...this.items]
  }
}
