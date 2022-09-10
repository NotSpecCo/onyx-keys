import { Priority } from './enums';
import { KeyPressEvent } from './events';
import { Duration, HandlerKey } from './models';

type NewHandler = {
  ownerId: string;
  key: HandlerKey;
  duration: Duration;
  priority: Priority;
  disabled: boolean;
  action: (ev: KeyPressEvent) => Promise<void>;
};

export class Handler {
  ownerId: string;
  key: HandlerKey;
  duration: Duration;
  priority: Priority;
  disabled: boolean;
  action: (ev: KeyPressEvent) => Promise<void>;
  working = false;

  constructor(handler: NewHandler) {
    this.ownerId = handler.ownerId;
    this.key = handler.key;
    this.duration = handler.duration;
    this.priority = handler.priority;
    this.disabled = handler.disabled;
    this.action = handler.action;
  }

  get fullName(): string {
    let type;
    switch (this.duration) {
      case 'short':
        type = 'Short';
        break;
      case 'long':
        type = 'Long';
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

  async call(ev: KeyPressEvent): Promise<void> {
    if (this.working) {
      return Promise.resolve();
    }

    // console.log(`${this.fullName}: called`);
    this.working = true;

    await this.action(ev).catch((err) => {
      console.log(`Failed to call handler: ${this.fullName}`, err);
    });

    // console.log(`${this.fullName}: finished`);
    this.working = false;
  }
}
