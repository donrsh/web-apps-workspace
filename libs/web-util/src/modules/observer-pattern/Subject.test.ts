import { Mock } from "vitest";
import { Subject } from "./Subject";

type ChatterEventsDef = {
  msg: { from: string; content: string };
};

type LonerEventsDef = {
  ping: undefined;
  pong: undefined;
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

describe("Subject", () => {
  const callbacks = {
    AliceOnMsg: vitest.fn(),
    BobOnMsg: vitest.fn(),
  };

  beforeEach(() => {
    Object.values(callbacks).forEach((x) => x.mockReset());
  });

  it("Auto Observe (play ping pong by self)", () => {
    const loner = new Subject<LonerEventsDef>("Loner", "Who Cares?");
    const onPong = vitest.fn();

    loner.on("ping", () => {
      loner.dispatch("pong", undefined);
    });
    loner.on("pong", onPong);

    loner.dispatch("ping", undefined);

    expect(onPong).toBeCalledTimes(1);
  });

  it("Talk between Alice and Bob", () => {
    const Alice = new Subject<ChatterEventsDef, ChatterEventsDef>(
        "Chatter",
        "Alice"
      ),
      Bob = new Subject<ChatterEventsDef, ChatterEventsDef>("Chatter", "Bob");

    Alice.on("msg", callbacks["AliceOnMsg"]),
      Bob.on("msg", callbacks["BobOnMsg"]);

    const AliceLeaves = Alice.observe(Bob),
      BobLeaves = Bob.observe(Alice);

    const msgFromAlice: ChatterEventsDef["msg"] = {
      from: "Alice",
      content: "Hi!",
    };
    Alice.send("msg", msgFromAlice);
    expect(callbacks["BobOnMsg"]).toBeCalledTimes(1);
    expectLastCalledWithEvent(callbacks["BobOnMsg"], "msg", msgFromAlice);

    const msgFromBob: ChatterEventsDef["msg"] = {
      from: "Bob",
      content: "Hello",
    };
    Bob.send("msg", msgFromBob);
    expect(callbacks["AliceOnMsg"]).toBeCalledTimes(1);
    expectLastCalledWithEvent(callbacks["AliceOnMsg"], "msg", msgFromBob);

    // Alice leaves
    AliceLeaves();
    callbacks["AliceOnMsg"].mockClear();
    console.log(callbacks["AliceOnMsg"].mock.calls);

    // Bob send msg again
    Bob.send("msg", msgFromBob);

    // Alice should not receive anything
    expect(callbacks["AliceOnMsg"]).not.toHaveBeenCalled();
  });
});
