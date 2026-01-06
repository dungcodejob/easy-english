export abstract class ValueObject<T> {
  abstract equals(other: T): boolean;

  protected shallowEquals(other: T, props: (keyof T)[]): boolean {
    if (!other) return false;
    return props.every((prop) => (this as unknown as T)[prop] === other[prop]);
  }
}
