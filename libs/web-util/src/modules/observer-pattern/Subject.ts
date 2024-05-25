import { Observable } from "./Observable";
import { Observer } from "./Observer";

export class Subject<
    SendEventsDef extends {},
    ReceivedEventsDef extends {} = SendEventsDef,
  >
  implements Observable<SendEventsDef>, Observer<ReceivedEventsDef>
{
  id: string;
  type: string;

  // Observable fields
  send: Observable<SendEventsDef>["send"];
  observers: Observable<SendEventsDef>["observers"];
  addObserver: Observable<SendEventsDef>["addObserver"];
  removeObserver: Observable<SendEventsDef>["removeObserver"];

  // EventsReceiver
  on: Observer<ReceivedEventsDef>["on"];
  off: Observer<ReceivedEventsDef>["off"];
  dispatch: Observer<ReceivedEventsDef>["dispatch"];
  observe: Observer<ReceivedEventsDef>["observe"];

  constructor(type: string, id?: string) {
    this.id = id ?? `__Observable__${Math.random().toString().slice(2, 10)}`;
    this.type = type;

    const observable = new Observable(type, id);

    this.observers = observable.observers;
    this.addObserver = observable.addObserver.bind(observable);
    this.removeObserver = observable.removeObserver.bind(observable);
    this.send = observable.send.bind(observable);

    const observer = new Observer(type, id);

    this.on = observer.on.bind(observer);
    this.off = observer.off.bind(observer);
    this.dispatch = observer.dispatch.bind(observer);
    this.observe = observer.observe.bind(observer);
  }
}
