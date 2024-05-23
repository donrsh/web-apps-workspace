import { useCallback, useMemo, useState } from "react";

type UseTogglerOption<T> = {
  initIsOpen?: boolean;
  initData?: T;
};

export type Toggler<T> = {
  isOpen: boolean;
  data: T | null;
  open: () => void;
  close: () => void;
  openWithData: (data?: T) => void;
  toggle: (isOpen?: boolean, data?: T) => void;
};

function useToggler<T = unknown>({
  initIsOpen = false,
  initData,
}: UseTogglerOption<T> = {}) {
  const [state, setState] = useState<{
    isOpen: boolean;
    data: T | null;
  }>({
    isOpen: initIsOpen,
    data: initIsOpen ? initData ?? null : null,
  });

  type TypedToggler = Toggler<T>;

  const open: TypedToggler["open"] = useCallback(() => {
    setState({
      isOpen: true,
      data: null,
    });
  }, []);

  const close: TypedToggler["close"] = useCallback(() => {
    setState({
      isOpen: false,
      data: null,
    });
  }, []);

  const openWithData: TypedToggler["openWithData"] = useCallback((data?: T) => {
    setState({
      isOpen: true,
      data: data ?? null,
    });
  }, []);

  const toggle: TypedToggler["toggle"] = useCallback(
    (isOpen?: boolean, data?: T) => {
      setState((x) => {
        const nextIsOpen = !x.isOpen;
        return {
          isOpen: nextIsOpen,
          data: nextIsOpen ? data ?? null : null,
        };
      });
    },
    []
  );

  return useMemo(
    () =>
      ({
        ...state,
        open,
        close,
        openWithData,
        toggle,
      }) as Toggler<T>,
    [state, open, close, openWithData, toggle]
  );
}

export default useToggler;
