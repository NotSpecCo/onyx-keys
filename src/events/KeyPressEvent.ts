import { Duration, HandlerKey } from '../models';
import { checkIfInput, parseKey } from '../utils';

type Data = {
  duration: Duration;
  key: HandlerKey;
  targetIsInput: boolean;
};

export class KeyPressEvent extends CustomEvent<Data> {
  repeat: boolean;

  constructor(base: KeyboardEvent, duration: Duration) {
    super('onyx:keypress', {
      bubbles: true,
      detail: {
        duration,
        key: parseKey(base),
        targetIsInput: checkIfInput(base),
      },
    });

    this.repeat = base.repeat;
  }
}
