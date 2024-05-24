import { Mock } from "vitest";
import { createEventsReceiver } from "./createEventsReceiver";

type ChatroomEventsDef = {
  BROADCAST: string;
  MEMBER_JOINED: { name: string };
  TERMINATE: undefined;
};

const expectLastCalledWithEvent = (
  fn: Mock<any, any>,
  type: string,
  detail: any
) => {
  expect(fn.mock.lastCall?.[0]).toHaveProperty("type", type);

  // new CustomEvent("type", {detail: undefined}).detail === null
  // Surprise 🙄
  expect(fn.mock.lastCall?.[0]).toHaveProperty("detail", detail ?? null);
};

describe("`createEventsReceiver`", () => {
  let mockCallbacks = {
    BROADCAST: vitest.fn(),
    MEMBER_JOINED: vitest.fn(),
    TERMINATE: vitest.fn(),
  } as const;

  let eventDetails: ChatroomEventsDef = {
    BROADCAST: "h1",
    MEMBER_JOINED: { name: "John" },
    TERMINATE: undefined,
  } as const;

  beforeEach(() => {
    Object.values(mockCallbacks).forEach((x) => x.mockReset());
  });

  it("basic", () => {
    const eventsReceiver = createEventsReceiver<ChatroomEventsDef>();

    const eventTypes: (keyof ChatroomEventsDef)[] = [
      "BROADCAST",
      "MEMBER_JOINED",
      "TERMINATE",
    ];

    eventTypes.forEach((x) => {
      eventsReceiver.dispatch(x, eventDetails[x]);

      // callback is not attached yet, so it's call times should be 0
      expect(mockCallbacks[x]).toBeCalledTimes(0);

      // attach callback and dispatch
      eventsReceiver.on(x, mockCallbacks[x]);
      eventsReceiver.dispatch(x, eventDetails[x]);

      expect(mockCallbacks[x]).toBeCalledTimes(1);
      expectLastCalledWithEvent(mockCallbacks[x], x, eventDetails[x]);

      // dispatch again
      eventsReceiver.dispatch(x, eventDetails[x]);
      expect(mockCallbacks[x]).toBeCalledTimes(2);
      expectLastCalledWithEvent(mockCallbacks[x], x, eventDetails[x]);

      // detach callback and dispatch
      eventsReceiver.off(x, mockCallbacks[x]);
      eventsReceiver.dispatch(x, eventDetails[x]);

      expect(mockCallbacks[x]).toBeCalledTimes(2);
    });
  });
});
