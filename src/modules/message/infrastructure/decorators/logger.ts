import type { ClassConstructor } from 'class-transformer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withLogging<T extends ClassConstructor<{ [key: string]: any }>>(BaseClass: T) {
  return class extends BaseClass {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }
  };
}
