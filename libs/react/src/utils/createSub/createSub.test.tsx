import { PropsWithChildren, forwardRef, memo, useMemo } from "react";
import { createSub } from "./createSub";
import { render } from "@testing-library/react";

const renderSpies = {
  table: vitest.fn(),
  header: vitest.fn(),
  body: vitest.fn(),
  row1: vitest.fn(),
  row2: vitest.fn(),
};

const getRenderSpiesCalledTimes = () =>
  Object.values(renderSpies).map((x) => x.mock.calls.length);

const TableComponentDict = {
  // forwardRef
  Root: forwardRef(({ children }: PropsWithChildren, ref) => {
    renderSpies.table();
    return <table {...{ children }} />;
  }),

  // fat arrow function
  Header: () => {
    renderSpies.header();
    return <thead></thead>;
  },

  // component dict
  Body: {
    Root: ({ children }: PropsWithChildren) => {
      renderSpies.body();
      return <tbody {...{ children }}></tbody>;
    },

    // object method
    Row1() {
      renderSpies.row1();
      return <tr></tr>;
    },

    // function expression
    Row2: function () {
      renderSpies.row2();
      return <tr></tr>;
    },
  },
};

describe("createSub", () => {
  it("no error", () => {
    const Table = createSub(TableComponentDict);

    expect(1).toBe(1);
  });

  it("components are wrapped by memo", () => {
    const Table = createSub(TableComponentDict);

    const TestComponent = ({ id }: { id: string }) => {
      return (
        <div {...{ id }}>
          {/* ✅ Table.Root should be rerendered, since its children is dynamic  */}
          <Table.Root>
            {/* ❌ Table.Header should NOT be rerendered, since its props doesn't change  */}
            <Table.Header />

            {/* ❌ Table.Body.Root should NOT be rerendered, since its props doesn't change, including children since it's memoed  */}
            <Table.Body.Root>
              {useMemo(() => {
                return (
                  <>
                    {/* ❌ The two Table.Body.Row should NOT be rerendered, since its props doesn't change  */}
                    <Table.Body.Row1 />
                    <Table.Body.Row2 />
                  </>
                );
              }, [])}
            </Table.Body.Root>
          </Table.Root>
        </div>
      );
    };

    // before render
    expect(getRenderSpiesCalledTimes()).toEqual([0, 0, 0, 0, 0]);

    const { rerender } = render(<TestComponent id="1" />);

    // after first render
    expect(getRenderSpiesCalledTimes()).toEqual([1, 1, 1, 1, 1]);

    rerender(<TestComponent id="2" />);

    // after rerender
    expect(getRenderSpiesCalledTimes()).toEqual([2, 1, 1, 1, 1]);
  });
});
