import { Button, EnumButtonStyle } from "@amplication/ui/design-system";
import React from "react";
import { Link } from "react-router-dom";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

export const NewPrivatePluginButton = React.memo(() => {
  const { baseUrl } = useProjectBaseUrl();

  return (
    <Link to={`${baseUrl}/private-plugins/new`}>
      <Button buttonStyle={EnumButtonStyle.Primary} style={{ width: "100%" }}>
        Add Plugin
      </Button>
    </Link>
  );
});
