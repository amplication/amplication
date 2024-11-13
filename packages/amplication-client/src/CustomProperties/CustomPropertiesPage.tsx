import React from "react";
import { match, useRouteMatch } from "react-router-dom";
import { isEmpty } from "lodash";
import PageContent from "../Layout/PageContent";
import CustomProperty from "./CustomProperty";
import { CustomPropertyList } from "./CustomPropertyList";
import { AppRouteProps } from "../routes/routesUtil";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
  }>;
};

const CustomPropertiesPage: React.FC<Props> = ({
  match,
  innerRoutes,
}: Props) => {
  const pageTitle = "Properties";

  const customPropertyMatch = useRouteMatch<{ customPropertyId: string }>([
    "/:workspace/settings/properties/:customPropertyId",
  ]);

  let customPropertyId = null;
  if (customPropertyMatch) {
    customPropertyId = customPropertyMatch.params.customPropertyId;
  }

  return (
    <PageContent
      pageTitle={pageTitle}
      className="customProperties"
      sideContent={
        <CustomPropertyList selectFirst={null === customPropertyId} />
      }
    >
      {match.isExact
        ? !isEmpty(customPropertyId) && <CustomProperty />
        : innerRoutes}
    </PageContent>
  );
};

export default CustomPropertiesPage;
