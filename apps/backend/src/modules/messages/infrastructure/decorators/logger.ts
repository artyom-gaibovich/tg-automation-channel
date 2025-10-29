import { ClassConstructor } from 'class-transformer';

export function withLogging<T extends ClassConstructor<{ [key: string]: any }>>(
  BaseClass: T
) {
  return class extends BaseClass {
    constructor(...args: any[]) {
      super(...args);
    }
  };
}
