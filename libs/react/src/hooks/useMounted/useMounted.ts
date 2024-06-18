import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export function useMountedRef() {
  const ref = useRef<boolean>(false);

  useLayoutEffect(() => {
    ref.current = true;
  }, []);

  return ref;
}
