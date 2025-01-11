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
  return (
    <div className="customProperties">
      {match.isExact ? <CustomPropertyList /> : innerRoutes}
    </div>
  );
};

export default CustomPropertiesPage;
