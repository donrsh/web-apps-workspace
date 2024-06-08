import { useReducer } from "react";

function useRerender() {
  const [, rerender] = useReducer((x) => x + 1, 0);

  return rerender;
}

export default useRerender;
