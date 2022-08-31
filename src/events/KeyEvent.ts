import { HandlerKey } from '../models';
import { generateId } from '../utils';

export class KeyEvent {
  id: string;
  base: KeyboardEvent;
  key: HandlerKey;
  isInputTarget: boolean = false;
  repeat: boolean;
  target: HTMLElement;

  constructor(baseEvent: KeyboardEvent) {
    this.id = generateId();
    this.base = baseEvent;
    this.key = this.parseKey(baseEvent);
    this.repeat = baseEvent.repeat;
    this.target = baseEvent.target as HTMLElement;
  }

  stop() {
    this.base.preventDefault();
    this.base.stopImmediatePropagation();
    this.base.stopPropagation();
  }

  private parseKey(ev: KeyboardEvent): HandlerKey {
    let key: string | null = ev.key;

    if (ev.shiftKey && ev.key === 'ArrowLeft') {
      key = 'SoftLeft';
    }
    if (ev.shiftKey && ev.key === 'ArrowRight') {
      key = 'SoftRight';
    }

    const validKeys = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Enter',
      'Backspace',
      'SoftLeft',
      'SoftRight',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '*',
      '0',
      '#',
    ];

    if (!validKeys.includes(key)) {
      key = 'Other';
    }

    const target = ev.target as HTMLElement | null;
    if (
      target?.tagName.toLowerCase() === 'input' ||
      target?.tagName.toLowerCase() === 'textarea' ||
      (target?.attributes as any).role?.value === 'textbox'
    ) {
      this.isInputTarget = true;
    }

    return key as HandlerKey;
  }
}
