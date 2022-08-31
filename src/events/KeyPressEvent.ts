import { HandlerType } from '../enums';
import { HandlerKey } from '../models';

type Data = {
  type: HandlerType;
  key: HandlerKey;
};

export class KeyPressEvent extends CustomEvent<Data> {
  constructor(key: HandlerKey, type: HandlerType) {
    super('onyx:keypress', { bubbles: true, detail: { key, type } });
  }
}
