import "../src/lib/index.scss";
import "../src/lib/style/css-variables.scss";
import "../src/lib/style/icon.scss";
import "../src/lib/icons";
import "../src/lib/custom-icons";

import React from "react";
import { MemoryRouter } from "react-router";

export const decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];
