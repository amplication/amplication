import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
} from "@amplication/ui/design-system";
import React from "react";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import { Link } from "react-router-dom";

const CLASS_NAME = "create-resource-button";

const CreateResourceButton: React.FC = () => {
  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: false });

  return (
    <div className={CLASS_NAME}>
      <Link to={`${baseUrl}/new-resource`}>
        <Button
          icon="plus"
          buttonStyle={EnumButtonStyle.Primary}
          iconPosition={EnumIconPosition.Left}
        >
          Create Resource
        </Button>
      </Link>
    </div>
  );
};

export default CreateResourceButton;
