import { render } from "@testing-library/react";
import NotFound from "./NotFoundPage";
// import App from "../App";
// import { MemoryRouter } from "react-router-dom";

const TEST_ID__WARNING = "warning";

describe("NotFoundPage", () => {
  it("renders the page content", () => {
    const { queryByTestId } = render(<NotFound />);

    expect(queryByTestId(TEST_ID__WARNING)).toBeTruthy();
  });

  // NOTE - jest config must be changed for this to work, I think

  // it("renders when path is an undefined route", () => {
  //   const badRoute = "/loginjflhvincohf99hch/34u";

  //   render(
  //     <MemoryRouter initialEntries={[badRoute]}>
  //       <App />
  //     </MemoryRouter>
  //   );

  //   expect(screen.getByTestId(TEST_ID__WARNING)).toBeTruthy();
  // });
});
