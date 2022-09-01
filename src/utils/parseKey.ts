import { HandlerKey } from '../models';

export function parseKey(ev: KeyboardEvent): HandlerKey {
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

  return key as HandlerKey;
}
