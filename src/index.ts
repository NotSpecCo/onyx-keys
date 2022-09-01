import { Priority } from './enums';
import { KeyPressEvent } from './events';
import { EventTranslator } from './EventTranslator';
import { Handler } from './Handler';
import { Handlers } from './Handlers';
import { HandlerKey, HandlerType } from './models';
import { generateId } from './utils';

type NewHandler = {
  key: HandlerKey;
  type?: HandlerType;
  priority?: Priority;
  disabled?: boolean;
  action: (ev: KeyPressEvent) => Promise<void>;
};

type Config = {
  longPressDelay: number;
  repeatDelay: number;
  repeatRate: number;
};

const defaultConfig: Config = {
  longPressDelay: 500,
  repeatDelay: 500,
  repeatRate: 100,
};

export class OnyxKeys {
  private static config: Config = defaultConfig;
  private static listening = false;
  private static handlers = Handlers;

  static setOptions(options: Partial<Config>) {
    this.config = {
      ...defaultConfig,
      ...options,
    };
  }

  static subscribe(handlers: NewHandler[]) {
    const ownerId = generateId();

    this.handlers.add(
      handlers.map(
        (a) =>
          new Handler({
            ownerId,
            key: a.key,
            type: a.type ?? 'short',
            priority: a.priority ?? Priority.Medium,
            disabled: a.disabled ?? false,
            action: a.action,
          })
      )
    );

    this.startListening();

    return {
      id: ownerId,
      disable: () => this.disable(ownerId),
      enable: () => this.enable(ownerId),
      unsubscribe: () => this.unsubscribe(ownerId),
    };
  }

  static unsubscribe(ownerId: string) {
    this.handlers.removeGroup(ownerId);
  }

  static disable(ownerId: string) {
    this.handlers.disableGroup(ownerId);
  }

  static enable(ownerId: string) {
    this.handlers.enableGroup(ownerId);
  }

  static startListening() {
    if (this.listening) {
      return;
    }

    EventTranslator.start(this.config);

    document.addEventListener('onyx:keypress', this.onKeyPress.bind(this) as any, true);

    this.listening = true;
  }
  static stopListening() {
    if (!this.listening) {
      return;
    }

    EventTranslator.stop();

    document.removeEventListener('onyx:keypress', this.onKeyPress.bind(this) as any, true);

    this.listening = false;
  }

  private static onKeyPress(ev: KeyPressEvent) {
    const handler = this.handlers.getPriorityHandler(ev.detail.key, ev.detail.type);

    if (!handler) return;

    ev.stopPropagation();
    ev.stopImmediatePropagation();
    ev.preventDefault();

    handler.call(ev);
  }
}
