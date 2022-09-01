import { KeyPressEvent } from '../events';
import { HandlerName } from './HandlerName';

export type HandlerMap = { [key in HandlerName]: (ev: KeyPressEvent) => Promise<void> };
