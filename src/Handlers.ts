import { Handler } from './Handler';
import { Duration, HandlerKey } from './models';

export class Handlers {
  static handlers: Handler[] = [];

  static getPriorityHandler(key: HandlerKey, duration: Duration): Handler | null {
    const handlers = this.handlers
      .filter((a) => !a.disabled && a.key === key && a.duration === duration)
      .sort((a, b) => {
        if (a.priority > b.priority) return 1;
        if (a.priority < b.priority) return -1;
        return 0;
      });
    return handlers[handlers.length - 1] || null;
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
