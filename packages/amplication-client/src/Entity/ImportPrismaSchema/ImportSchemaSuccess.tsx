import {
  EnumButtonStyle,
  EnumContentAlign,
  EnumFlexItemMargin,
  EnumGapSize,
  FlexItem,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../Components/Button";
import { AppContext } from "../../context/appContext";
import {
  BtmButton,
  EnumButtonLocation,
} from "../../Resource/break-the-monolith/BtmButton";

export const ImportSchemaSuccess = () => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  const entitiesUrl = `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/entities`;

  return (
    <FlexItem
      gap={EnumGapSize.Large}
      margin={EnumFlexItemMargin.Both}
      contentAlign={EnumContentAlign.Center}
    >
      <Link to={entitiesUrl}>
        <Button buttonStyle={EnumButtonStyle.Outline}>
          View imported entities
        </Button>
      </Link>

      <BtmButton
        location={EnumButtonLocation.SchemaUpload}
        openInFullScreen={true}
      />
    </FlexItem>
  );
};
