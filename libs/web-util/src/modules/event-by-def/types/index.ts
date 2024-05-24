type EventsDef = Record</* EventType */ string, /* EventDetail */ any>;

type EventCallback<Event> = (
  evt: Event
) => void | { handleEvent: (evt: Event) => void };

export type EventsDict<Def extends EventsDef = {}> = {
  [type in keyof Def]: CustomEvent<NonNullable<Def[keyof Def]>>;
};

export interface EventCreator<Def extends {}> {
  (
    type: keyof Def,
    detail: Def[keyof Def]
  ): CustomEvent<NonNullable<Def[keyof Def]>>;
}

export interface EventsSender<Def extends {}> {
  send<T extends keyof Def>(type: T, payload: Def[T]): void;
}

export interface EventsReceiver<Def extends {}> {
  on<T extends keyof Def>(
    type: T,
    callback: EventCallback<CustomEvent<Def[T]>>
  ): void;

  off<T extends keyof Def>(
    type: T,
    callback: EventCallback<CustomEvent<Def[T]>>
  ): void;

  dispatch<T extends keyof Def>(type: T, payload: Def[T]): void;
}

///////////////////////////////////

// interface CounterEventsDef {
//   increase: number;
//   decrease: number;
//   reset: undefined;
// }

// type CounterEventsDict = EventsDict<CounterEventsDef>;

// const increaseEvent: CounterEventsDict["increase"] = new CustomEvent(
//   "increase",
//   { detail: 1 }
// );

// let createCounterEvents: EventCreator<CounterEventsDef>;
// createCounterEvents("reset", undefined);

// let eventsReceiver: EventsReceiver<CounterEventsDef>;
// eventsReceiver.on("decrease", (e) => {
//   e.detail;
// });
