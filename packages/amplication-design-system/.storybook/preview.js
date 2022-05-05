import "../icons/amplicationicon.css";

import "../src/index.scss";
import "../src/style/icon.scss";
import "../src/style/css-variables.scss";
import "../icons";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
