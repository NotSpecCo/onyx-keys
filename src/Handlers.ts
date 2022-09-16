import { Priority } from './enums';
import { Handler } from './Handler';
import { Duration, HandlerKey } from './models';

export class Handlers {
  static handlers: Handler[] = [];

  static getPriorityHandlers(key: HandlerKey, duration: Duration): Handler[] {
    const handlers = this.handlers
      .filter((a) => !a.disabled && a.key === key && a.duration === duration)
      .reduce((acc, val) => {
        if (!acc[val.priority]) acc[val.priority] = [val];
        else acc[val.priority].push(val);
        return acc;
      }, {} as { [key: number]: Handler[] });

    return (
      handlers[Priority.Highest] ||
      handlers[Priority.High] ||
      handlers[Priority.Medium] ||
      handlers[Priority.Low] ||
      handlers[Priority.Lowest] ||
      []
    );
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
