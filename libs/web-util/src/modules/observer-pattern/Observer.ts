import { createEventsReceiver } from "../event-by-def";
import { EventsReceiver } from "../event-by-def/types";
import { Observable } from "./Observable";

export class Observer<ReceivedEventsDef extends {}>
  implements EventsReceiver<ReceivedEventsDef>
{
  id: string;
  type: string;

  on: EventsReceiver<ReceivedEventsDef>["on"];
  off: EventsReceiver<ReceivedEventsDef>["off"];
  dispatch: EventsReceiver<ReceivedEventsDef>["dispatch"];

  observe: (observable: Observable<any>) => () => void;

  constructor(type: string, id?: string) {
    this.id = id ?? `__Observer__${Math.random().toString().slice(2, 10)}`;
    this.type = type;

    const eventsReceiver = createEventsReceiver<ReceivedEventsDef>();
    this.on = eventsReceiver.on;
    this.off = eventsReceiver.off;
    this.dispatch = eventsReceiver.dispatch;

    this.observe = (observable: Observable<any>) =>
      observable.addObserver(this);
  }
}
