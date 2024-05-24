import { EventCreator } from "./types";

/* 
  This has the same implementation problem as zustand `create`.

  In short, if one expects to get TypeScript intellisense,
  he has to invoke twice:
  `const event = createEvent<EventsDef>()(type, detail)`

  See: https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md
*/
export function createEventByDef<EventsDef extends {}>() {
  const eventCreator: EventCreator<EventsDef> = (type, detail) => {
    return new CustomEvent(type as any, { detail }) as any;
  };

  return eventCreator;
}
