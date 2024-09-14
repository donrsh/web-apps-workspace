import { ComponentProps, ReactNode, memo } from "react";

export type ReferenceEntry = {
  title: ReactNode;
  description?: ReactNode;
  link: string;
};

export type SourceCodeRefsProps = {
  title?: ReactNode;
  data: ReferenceEntry[];
} & Omit<ComponentProps<"details">, "title">;

function SourceCodeRefs({
  title = <b>Source Code References</b>,
  data,
  ...rest
}: SourceCodeRefsProps) {
  return (
    <details {...rest}>
      <summary>{title}</summary>
      <ul>
        {data.map((x, idx) => {
          return (
            <li key={idx} style={{ marginBlock: -8 }}>
              <div className="row-vcenter" style={{ gap: 8 }}>
                <span style={{ fontWeight: 500 }}>{x.title}</span>
                <span>
                  (<a href={x.link}>link</a>)
                </span>
              </div>
              <p>{x.description}</p>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

export default memo(SourceCodeRefs);
