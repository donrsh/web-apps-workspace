import { ComponentProps, useCallback, useEffect, useRef } from "react";

function RenderedTimes(props: ComponentProps<"span">) {
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current = countRef.current + 1;
  });

  // Since React trigger one extra setup + cleanup cycle in useEffect,
  // we need to exclude that count
  useEffect(() => {
    return () => {
      if (import.meta.env.DEV) {
        countRef.current = countRef.current - 1;
      }
    };
  }, []);

  return (
    <span
      {...props}
      onClick={useCallback(() => alert(countRef.current), [])}
      style={{
        backgroundColor: "lightgray",
        padding: "2px 8px",
        borderRadius: 4,
        ...props.style,
      }}
    >
      {/* 
        Since we use ref + effect to store the rendered time,
        updating the rendered time won't trigger rerender.
        Thus, the value is always lagged to the real value by 1,
        we just add it back
      */}
      {countRef.current + 1}
    </span>
  );
}

export default RenderedTimes;
