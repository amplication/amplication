import React from "react";
import Provider from "../src/components/Provider";

import "../src/index.scss";
import "../src/style/icon.scss";
import "../src/style/css-variables.scss";
import "../icons";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
};

export const decorators = [
  (Story) => (
    <div style={{ padding: "1em", height: "100vh", overflow: "auto" }}>
      <Provider>
        <Story />
      </Provider>
    </div>
  ),
];
