import { useLoaderData } from "@remix-run/react";

import "./styles.css";

export const clientLoader = async () => {
  return fetch("/mock/example/pi");
};

export default function Page() {
  const data = useLoaderData<number>();

  return (
    <h1 style={{ textAlign: "center" }}>
      from MSW
      <br />
      <span className="rainbow" style={{ fontSize: "3rem" }}>
        {data}
      </span>{" "}
      <br />
      🤟🤟🤟
    </h1>
  );
}
