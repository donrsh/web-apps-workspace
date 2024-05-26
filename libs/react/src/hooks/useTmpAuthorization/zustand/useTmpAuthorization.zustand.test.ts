import { act, renderHook } from "@testing-library/react";
import { createTmpAuthorizationStore } from "./useTmpAuthorization.zustand";

type Auth = { userName: string; token: string };

const around = (center: number, delta: number) => (n: number) =>
  n >= center - delta && n <= center + delta;
const minToMs = (min: number) => min * 60 * 1000;

describe("useTmpAuthorization (zustand)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("basic", async () => {
    const useTmpAuthorization = createTmpAuthorizationStore<Auth>({
      expireTime: 3 * 60 * 1_000, // 3 min
    });

    let { result: $ } = renderHook(() => useTmpAuthorization());

    expect($.current).toHaveProperty("isPrompting", false);
    expect($.current).toHaveProperty("current", null);
    expect(
      [$.current.prompt, $.current.promptCancel, $.current.promptConfirm].every(
        (x) => typeof x === "function"
      )
    ).toBe(true);
    expect($.current.getTimeToExpire()).toBe(null);

    act(() => {
      $.current.prompt();
    });
    expect($.current.isPrompting).toBe(true);
    expect($.current.current).toBe(null);

    act(() => {
      $.current.promptCancel();
    });
    await vi.waitUntil(() => $.current.isPrompting === false);

    act(() => {
      $.current.prompt();
    });
    await vi.waitUntil(() => $.current.isPrompting === true);

    const auth: Auth = { userName: "John", token: "12345" };
    act(() => {
      $.current.promptConfirm(auth);
    });
    await vi.waitUntil(() => $.current.isPrompting === false);
    expect($.current.current).toEqual(auth);

    // 1 min elapsed ...
    await act(async () => {
      await vi.advanceTimersByTimeAsync(minToMs(1));
    });
    expect($.current.current).toEqual(auth);
    // console.log("expireTime", $.current.getExpireTime());

    // 2 min elapsed ...
    await act(async () => {
      await vi.advanceTimersByTimeAsync(minToMs(1));
    });
    expect($.current.current).toEqual(auth);
    // console.log("expireTime", $.current.getExpireTime());

    // 3 min elapsed, should expire
    await act(async () => {
      await vi.advanceTimersByTimeAsync(
        minToMs(1) + //
          1_000 /* add some time 😜 */
      );
    });
    expect($.current.current).toBe(null);
    expect($.current.getTimeToExpire()).toBe(null);
  });

  it("prolong & clear", async () => {
    const useTmpAuthorization = createTmpAuthorizationStore<Auth>({
      expireTime: 3 * 60 * 1_000, // 3 min
    });

    let { result: $ } = renderHook(() => useTmpAuthorization());

    const auth: Auth = { userName: "John", token: "12345" };
    act(() => {
      $.current.prompt();
      $.current.promptConfirm(auth);
    });
    expect($.current.current).toBe(auth);
    expect($.current.getTimeToExpire()).toSatisfy(around(minToMs(3), 1_000));

    // 1 min elapsed ...
    await act(async () => {
      await vi.advanceTimersByTimeAsync(minToMs(1));
    });
    expect($.current.getTimeToExpire()).toSatisfy(around(minToMs(2), 1_000));

    // prolong 5 mins
    await act(async () => {
      $.current.prolong(minToMs(5));
    });
    expect($.current.getTimeToExpire()).toSatisfy(around(minToMs(7), 1_000));

    // 3 min elapsed ...
    await act(async () => {
      await vi.advanceTimersByTimeAsync(minToMs(3));
    });
    expect($.current.getTimeToExpire()).toSatisfy(around(minToMs(4), 1_000));

    act(() => {
      $.current.clear();
    });
    expect($.current.current).toBe(null);
    expect($.current.getTimeToExpire()).toBe(null);

    expect(1).toBe(1);
  });
});
