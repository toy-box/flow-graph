const UNSUBSCRIBE_ID_SYMBOL = Symbol('UNSUBSCRIBE_ID_SYMBOL');

export interface ISubscriber<Payload = any> {
  (payload: Payload): void | boolean;
}

export class Subscribable<ExtendsType = any> {
  private subscribers: Map<number, ISubscriber> = new Map();
  private index: number = 0;

  dispatch<T extends ExtendsType = any>(event: T, context?: any) {
    let interrupted = false;
    this.subscribers.forEach((sub, key) => {
      if (typeof sub === 'function') {
        event['context'] = context;
        if (sub(event) === false) {
          interrupted = true;
        }
      }
      return interrupted ? false : true;
    });
  }

  subscribe(subscriber: ISubscriber) {
    let id: number | undefined;
    if (typeof subscriber === 'function') {
      id = this.index + 1;
      this.subscribers.set(id, subscriber);
      this.index++;
    }
    const unsubscribe = () => {
      this.unsubscribe(id);
    };

    unsubscribe[UNSUBSCRIBE_ID_SYMBOL] = id;

    return unsubscribe;
  }

  unsubscribe = (id?: number | string | (() => void)) => {
    if (id === undefined || id === null) {
      for (const key in this.subscribers) {
        this.unsubscribe(key);
      }
      return;
    }
    if (typeof id !== 'function') {
      delete this.subscribers[id];
    } else {
      delete this.subscribers[id[UNSUBSCRIBE_ID_SYMBOL]];
    }
  };
}
