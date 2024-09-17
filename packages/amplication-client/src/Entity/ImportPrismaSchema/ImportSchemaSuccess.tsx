import {
  EnumButtonStyle,
  EnumContentAlign,
  EnumFlexItemMargin,
  EnumGapSize,
  FlexItem,
} from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import { Button } from "../../Components/Button";
import {
  BtmButton,
  EnumButtonLocation,
} from "../../Resource/break-the-monolith/BtmButton";
import { useResourceBaseUrl } from "../../util/useResourceBaseUrl";

export const ImportSchemaSuccess = () => {
  const { baseUrl } = useResourceBaseUrl();

  const entitiesUrl = `${baseUrl}/entities`;

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
