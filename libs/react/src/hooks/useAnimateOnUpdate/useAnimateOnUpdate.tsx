import { useEffect } from "react";
import useRerender from "../useRerender";
import { useMountedRef } from "../useMounted";

function useAnimateOnUpdate(
  el: HTMLElement | null | undefined,
  animationClassName: string,
  ensureElWithAdditionalRerender: boolean = true
) {
  const rerender = useRerender();
  const mountedRef = useMountedRef();

  useEffect(() => {
    if (ensureElWithAdditionalRerender && !mountedRef.current) {
      rerender();
    }
  }, []);

  useEffect(() => {
    el?.classList.add(animationClassName);
  });

  useEffect(() => {
    el?.addEventListener("animationend", (e) => {
      (e.currentTarget as any as HTMLElement).classList.remove(
        animationClassName
      );
    });
  }, [el, animationClassName]);
}

export default useAnimateOnUpdate;
