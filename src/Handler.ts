import { HandlerType, Priority } from './enums';
import { HandlerKey } from './models';

type NewHandler = {
  ownerId: string;
  key: HandlerKey;
  type: HandlerType;
  priority: Priority;
  disabled: boolean;
  action: () => Promise<boolean>;
};

export class Handler {
  ownerId: string;
  key: HandlerKey;
  type: HandlerType;
  priority: Priority;
  disabled: boolean;
  action: () => Promise<boolean>;
  working = false;

  constructor(handler: NewHandler) {
    this.ownerId = handler.ownerId;
    this.key = handler.key;
    this.type = handler.type;
    this.priority = handler.priority;
    this.disabled = handler.disabled;
    this.action = handler.action;
  }

  get fullName(): string {
    let type;
    switch (this.type) {
      case HandlerType.Short:
        type = 'Short';
        break;
      case HandlerType.Long:
        type = 'Long';
        break;
      case HandlerType.Repeat:
        type = 'Repeat';
        break;
    }

    return `on${this.key}${type}`;
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  call(): Promise<boolean> {
    if (this.working) {
      return Promise.resolve(true);
    }

    console.log(`${this.fullName}: called`);
    this.working = true;

    return this.action()
      .catch((err) => {
        console.log(`Failed to call handler: ${this.fullName}`, err);
        return true;
      })
      .finally(() => {
        console.log(`${this.fullName}: finished`);
        this.working = false;
      });
  }
}
