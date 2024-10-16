import * as models from "../models";

import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import "./AlertLink.scss";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = {
  alert: models.OutdatedVersionAlert;
};

const CLASS_NAME = "outdated-version-alert-link";

function AlertLink({ alert }: Props) {
  const { id } = alert;

  const { baseUrl } = useResourceBaseUrl({
    overrideIsPlatformConsole: false,
    overrideResourceId: alert.resourceId,
  }); //always view the alert details in the service

  const url = `${baseUrl}/tech-debt/${id}`;

  return (
    <Link className={CLASS_NAME} to={url}>
      <Text textStyle={EnumTextStyle.Tag}>View Details</Text>
    </Link>
  );
}

export default AlertLink;
