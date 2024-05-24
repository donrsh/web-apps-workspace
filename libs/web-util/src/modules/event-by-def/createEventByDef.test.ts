import { createEventByDef } from "./createEventByDef";

type ChatroomEventsDef = {
  BROADCAST: string;
  MEMBER_JOINED: { name: string };
  TERMINATE: undefined;
};

describe("`createEventByDef`", () => {
  it("basic", () => {
    const broadcastMsg: ChatroomEventsDef["BROADCAST"] = "Hi everyone!";
    const broadcastEvent = createEventByDef<ChatroomEventsDef>()(
      "BROADCAST",
      broadcastMsg
    );

    expect(broadcastEvent.type).toBe("BROADCAST");
    expect(broadcastEvent.detail).toBe(broadcastMsg);
  });
});
