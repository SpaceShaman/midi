export default class EventEmitter<T> {
  private callbacks: Set<(data: T) => void> = new Set();

  subscribe(callback: (data: T) => void): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  emit(data: T): void {
    this.callbacks.forEach((callback) => callback(data));
  }
}
