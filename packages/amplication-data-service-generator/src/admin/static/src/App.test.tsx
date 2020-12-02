import React from "react";
import { render } from "@testing-library/react";
// @ts-ignore
import App from "./App";

test("renders app", () => {
  render(<App />);
});
