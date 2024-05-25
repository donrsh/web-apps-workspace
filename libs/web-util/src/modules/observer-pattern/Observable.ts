import { EventsSender } from "../event-by-def/types";
import { Observer } from "./Observer";

export class Observable<SendEventsDef extends {}>
  implements EventsSender<SendEventsDef>
{
  id: string;
  type: string;

  observers: Set<Observer<any>>;
  addObserver: (
    observer: Observer<any>
  ) => () => void /* removeObserver function */;
  removeObserver: (observer: Observer<any>) => void;

  send: EventsSender<SendEventsDef>["send"];

  constructor(type: string, id?: string) {
    this.id = id ?? `__Observable__${Math.random().toString().slice(2, 10)}`;
    this.type = type;

    this.observers = new Set();
    this.addObserver = (observer: Observer<any>) => {
      this.observers = this.observers.add(observer);
      return () => {
        this.observers.delete(observer);
      };
    };
    this.removeObserver = (observer: Observer<any>) => {
      this.observers.delete(observer);
    };

    this.send = (type, payload) => {
      this.observers.forEach((x) => x.dispatch(type, payload));
    };
  }
}
