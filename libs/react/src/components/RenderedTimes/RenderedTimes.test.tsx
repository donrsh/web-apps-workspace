import { render } from "@testing-library/react";
import RenderedTimes from "./RenderedTimes";

describe("<RenderedTimes />", () => {
  it("basic", async () => {
    const testId = {
      renderedTime: "rendered-time",
    };

    const { rerender, queryByTestId } = render(
      <RenderedTimes data-testid={testId.renderedTime} />
    );
    expect(queryByTestId(testId.renderedTime)?.innerText).toBe("1");

    rerender(<RenderedTimes data-testid={testId.renderedTime} />);
    expect(queryByTestId(testId.renderedTime)?.innerText).toBe("2");

    rerender(<RenderedTimes data-testid={testId.renderedTime} />);
    expect(queryByTestId(testId.renderedTime)?.innerText).toBe("3");
  });
});
