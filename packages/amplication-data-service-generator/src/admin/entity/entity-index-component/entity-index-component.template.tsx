import * as React from "react";
import { Switch } from "react-router-dom";
// @ts-ignore
import PrivateRoute from "../components/PrivateRoute";

declare const ENTITY_PATH: string;
declare const ENTITY_LIST_COMPONENT: React.ComponentType<any>;
declare const NEW_ENTITY_COMPONENT: React.ComponentType<any>;
declare const ENTITY_COMPONENT: React.ComponentType<any>;

export const COMPONENT_NAME = (): React.ReactElement => {
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
