import { map } from "ramda";
import { memo, ComponentType, isValidElement, ElementType } from "react";
import { isValidElementType } from "react-is";

type ComponentDict = {
  [name: string]: ElementType | ComponentDict;
};

/**
 * This function is used to create components from object
 * for better component code organization.
 *
 * The returned object is of the same types as the parameter,
 * `createSub` simply wrap the components with
 * `memo` for better performance.
 *
 * The object is allowed to be arbitrarily deep.
 *
 * @example
 * ```
 * const Table = createSub({
 *   Root: ({ children }) => <table>{children}</table>,
 *   Head: () => <thead/>,
 *   Body: {
 *     Root: ({ children }) => <tbody>{children}></tbody>,
 *     Row: ({ data }) => <tr></tr>
 *   }
 * })
 *
 * render(
 *   <Table.Root>
 *     <Table.Head/>
 *     <Table.Body>
 *       <Table.Row />
 *     </Table.Body>
 *   </Table.Root>
 * )
 * ```
 *
 *
 */
export function createSub<const T extends ComponentDict>(componentMap: T) {
  const mapComponent = memo;

  const mapFn = <U extends ComponentType | ComponentDict>(x: U): U => {
    return isValidElementType(x)
      ? mapComponent(x)
      : (map(mapFn, x as any) as any);
  };

  return map(mapFn, componentMap) as T;
}
