import { createEventByDef } from "./createEventByDef";
import { EventsReceiver } from "./types";

export function createEventsReceiver<EventsDef extends {}>() {
  const eventTarget = new EventTarget();

  const dispatch: EventsReceiver<EventsDef>["dispatch"] = (type, detail) => {
    eventTarget.dispatchEvent(createEventByDef<EventsDef>()(type, detail));
  };

  return {
    on: eventTarget.addEventListener.bind(eventTarget),
    off: eventTarget.removeEventListener.bind(eventTarget),
    dispatch,
  } as EventsReceiver<EventsDef>;
}
