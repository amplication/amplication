import * as React from "react";
import { RMWCProvider } from "@rmwc/provider";

type Props = {
  children: React.ReactChild;
};

const Provider = ({ children }: Props): React.ReactElement => (
  <RMWCProvider
    // Globally disable ripples
    ripple={false}
    icon={{
      basename: "amp-icon",
    }}
  >
    {children}
  </RMWCProvider>
);

export default Provider;
