import useToggler, { type Toggler } from "./useToggler";
import { renderHook, act } from "@testing-library/react";

const expectTogglerIsOpen = (toggler: Toggler<any>, data?: any) => {
  expect(toggler.isOpen).toBe(true);
  expect(toggler.data).toEqual(data ?? null);
};

const expectTogglerIsClosed = (toggler: Toggler<any>) => {
  expect(toggler.isOpen).toBe(false);
  expect(toggler.data).toEqual(null);
};

describe("`useToggler`", () => {
  describe("initialize", () => {
    const data = { n: 42 };

    it("without params", () => {
      const { result } = renderHook(() => useToggler<typeof data>());
      let current = result.current;

      // field data and types
      {
        expectTogglerIsClosed(current);
        expect(
          [
            current.open,
            current.close,
            current.openWithData,
            current.toggle,
          ].every((x) => typeof x === "function")
        ).toBe(true);
      }
    });

    it("with params", () => {
      const {
        result: { current: toggler1 },
      } = renderHook(() =>
        useToggler<typeof data>({
          initIsOpen: true,
          initData: data,
        })
      );
      expectTogglerIsOpen(toggler1, data);

      const {
        result: { current: toggler2 },
      } = renderHook(() =>
        useToggler<typeof data>({
          initIsOpen: true,
        })
      );
      expectTogglerIsOpen(toggler2);

      const {
        result: { current: toggler3 },
      } = renderHook(() =>
        useToggler<typeof data>({
          initIsOpen: false,
          initData: data,
        })
      );
      expectTogglerIsClosed(toggler3);

      const {
        result: { current: toggler4 },
      } = renderHook(() =>
        useToggler<typeof data>({
          initIsOpen: false,
        })
      );
      expectTogglerIsClosed(toggler4);
    });
  });

  it(".open/.close/.openWithData", () => {
    const data = { n: 42 };
    const { result } = renderHook(() => useToggler<typeof data>());

    let current = result.current;
    const refreshCurrent = () => {
      current = result.current;
    };

    // open without data
    {
      act(() => current.open());
      refreshCurrent();

      expectTogglerIsOpen(current);
    }

    // close
    {
      act(() => current.close());
      refreshCurrent();

      expectTogglerIsClosed(current);
    }

    // open with data
    {
      act(() => current.openWithData(data));
      refreshCurrent();

      expectTogglerIsOpen(current, data);
    }
  });

  it(".toggle", () => {
    const data = { n: 42 };
    const { result } = renderHook(() => useToggler<typeof data>());

    let prev = result.current,
      current = result.current;
    const refreshCurrent = () => {
      prev = current;
      current = result.current;
    };

    // toggle
    {
      act(() => current.toggle());
      refreshCurrent();

      prev.isOpen
        ? expectTogglerIsClosed(current)
        : expectTogglerIsOpen(current);
    }

    // toggle again
    {
      act(() => current.toggle());
      refreshCurrent();

      prev.isOpen
        ? expectTogglerIsClosed(current)
        : expectTogglerIsOpen(current);
    }
    // toggle with parameter
    {
      act(() => current.toggle(true, data));
      refreshCurrent();

      prev.isOpen
        ? expectTogglerIsClosed(current)
        : expectTogglerIsOpen(current, data);
    }
    // toggle with parameter
    {
      act(() => current.toggle(false, data));
      refreshCurrent();

      prev.isOpen
        ? expectTogglerIsClosed(current)
        : expectTogglerIsOpen(current);
    }
  });
});
