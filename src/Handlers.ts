import { Handler } from './Handler';
import { HandlerKey, HandlerType } from './models';

export class Handlers {
  static handlers: Handler[] = [];

  static getPriorityHandler(key: HandlerKey, type: HandlerType): Handler | null {
    const handlers = this.handlers
      .filter((a) => !a.disabled && a.key === key && a.type === type)
      .sort((a, b) => {
        if (a.priority > b.priority) return 1;
        if (a.priority < b.priority) return -1;
        return 0;
      });
    return handlers.at(-1) || null;
  }

  static add(handlers: Handler[]) {
    this.handlers = [...this.handlers, ...handlers];
  }

  static removeGroup(ownerId: string): void {
    this.handlers = this.handlers.filter((a) => a.ownerId !== ownerId);
  }

  static disableGroup(ownerId: string): void {
    this.handlers.forEach((a) => {
      if (a.ownerId === ownerId) a.disable();
    });
  }

  static enableGroup(ownerId: string): void {
    this.handlers.forEach((a) => {
      if (a.ownerId === ownerId) a.enable();
    });
  }
}
