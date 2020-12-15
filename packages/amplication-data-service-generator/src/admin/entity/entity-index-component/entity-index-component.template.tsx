import * as React from "react";
import { Switch } from "react-router-dom";
// @ts-ignore
import PrivateRoute from "../components/PrivateRoute";
// @ts-ignore
import useBreadcrumbs from "../components/breadcrumbs/use-breadcrumbs";

declare const ENTITY_PATH: string;
declare const ENTITY_LIST_COMPONENT: React.ComponentType<any>;
declare const NEW_ENTITY_COMPONENT: React.ComponentType<any>;
declare const ENTITY_COMPONENT: React.ComponentType<any>;
declare const ENTITY_PLURAL_DISPLAY_NAME: string;

export const COMPONENT_NAME = (): React.ReactElement => {
  useBreadcrumbs(`${ENTITY_PATH}/`, ENTITY_PLURAL_DISPLAY_NAME);

  return (
    <Switch>
      <PrivateRoute
        exact
        path={`${ENTITY_PATH}/`}
        component={ENTITY_LIST_COMPONENT}
      />
      <PrivateRoute
        path={`${ENTITY_PATH}/new`}
        component={NEW_ENTITY_COMPONENT}
      />
      <PrivateRoute path={`${ENTITY_PATH}/:id`} component={ENTITY_COMPONENT} />
    </Switch>
  );
};
