import { Mock } from "vitest";
import { Observer } from "./Observer";
import { Observable } from "./Observable";

type SendEventsDefA = {
  string: string;
};

type SendEventsDefB = {
  boolean: boolean;
  number: number;
};

type ReceiveEventDef = SendEventsDefA & { whatever: any };

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

describe("ObserverObservable", () => {
  const callbacks = {
    OR1_on_string: vitest.fn(),
    OR2_on_string: vitest.fn(),
    OR3_on_string: vitest.fn(),
  };

  beforeEach(() => {
    Object.values(callbacks).forEach((x) => x.mockReset());
  });

  it("basic", () => {
    // OE stands for ObservablE, OR stands for ObserveR
    const OE_A = new Observable<SendEventsDefA>("Observable1");
    const OE_B = new Observable<SendEventsDefB>("Observable2");

    const OR_1 = new Observer<ReceiveEventDef>("Observer1");
    OR_1.on("string", callbacks["OR1_on_string"]);
    const OR_2 = new Observer<ReceiveEventDef>("Observer2");
    OR_2.on("string", callbacks["OR2_on_string"]);
    const OR_3 = new Observer<ReceiveEventDef>("Observer3");
    OR_3.on("string", callbacks["OR3_on_string"]);

    [
      callbacks["OR1_on_string"],
      callbacks["OR2_on_string"],
      callbacks["OR3_on_string"],
    ].forEach((x) => {
      expect(x).not.toHaveBeenCalled();
    });

    const unsub_OR1_to_OEA = OE_A.addObserver(OR_1);
    const unsub_OR2_to_OEA = OE_A.addObserver(OR_2);
    const unsub_OR3_to_OEA = OE_A.addObserver(OR_3);

    const sendType = "string";
    const [sendPayload1, sendPayload2, sendPayload3] = ["111", "222", "333"];

    // SA sends
    {
      OE_A.send(sendType, sendPayload1);

      [
        callbacks["OR1_on_string"],
        callbacks["OR2_on_string"],
        callbacks["OR3_on_string"],
      ].forEach((x) => {
        expect(x).toBeCalledTimes(1);
        expectLastCalledWithEvent(x, sendType, sendPayload1);
      });
    }

    // unsubscribe O3 to SA and SA sends
    {
      unsub_OR3_to_OEA();
      OE_A.send(sendType, sendPayload2);

      [callbacks["OR1_on_string"], callbacks["OR2_on_string"]].forEach((x) => {
        expect(x).toBeCalledTimes(2);
        expectLastCalledWithEvent(x, sendType, sendPayload2);
      });

      expect(callbacks["OR3_on_string"]).toBeCalledTimes(1);
    }

    // remove O2 from SA and SA sends
    {
      OE_A.removeObserver(OR_2);
      OE_A.send(sendType, sendPayload3);

      [callbacks["OR1_on_string"]].forEach((x) => {
        expect(x).toBeCalledTimes(3);
        expectLastCalledWithEvent(x, sendType, sendPayload3);
      });

      expect(callbacks["OR2_on_string"]).toBeCalledTimes(2);
      expect(callbacks["OR3_on_string"]).toBeCalledTimes(1);
    }
  });
});
