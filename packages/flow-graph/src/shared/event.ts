import { Subscribable } from './subscribable';

export interface ICustomEvent<EventData = any> {
  type: string;
  data?: EventData;
}

/**
 * 事件引擎
 */
export class EventEngine extends Subscribable<ICustomEvent<any>> {
  constructor() {
    super();
  }
}
