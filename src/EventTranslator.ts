import { KeyEvent, KeyPressEvent } from './events';

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

export class EventTranslator {
  private static config: Config = defaultConfig;
  private static listening = false;
  private static pressedKey: string | null = null;
  private static longPressFired = false;

  private static keyDownTime: number | null;
  private static get keyDownDuration(): number {
    if (!this.keyDownTime) return 0;
    return Math.floor(performance.now()) - this.keyDownTime;
  }

  static start(options?: Partial<Config>) {
    if (this.listening) {
      return;
    }

    this.config = {
      ...defaultConfig,
      ...options,
    };

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    this.listening = true;
  }
  static stop() {
    if (!this.listening) {
      return;
    }

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    this.listening = false;
  }

  private static handleKeyDown(ev: KeyboardEvent) {
    const event = new KeyEvent(ev);

    if (event.key === 'Other') return;

    if (!event.repeat) {
      this.pressedKey = event.key;
      this.keyDownTime = Math.floor(performance.now());
    }

    if (event.repeat) {
      event.target.dispatchEvent(new KeyPressEvent(event.key, 'repeat'));
    }

    if (!this.longPressFired && this.keyDownDuration >= this.config.longPressDelay) {
      this.longPressFired = true;
      event.target.dispatchEvent(new KeyPressEvent(event.key, 'long'));
    }
  }

  private static handleKeyUp(ev: KeyboardEvent) {
    const event = new KeyEvent(ev);
    if (event.key === 'Other' || event.key !== this.pressedKey) return;

    if (this.keyDownDuration < this.config.longPressDelay) {
      event.target.dispatchEvent(new KeyPressEvent(event.key, 'short'));
    }
  }
}
