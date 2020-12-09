import * as React from "react";
import { Switch, Route } from "react-router-dom";

declare const ENTITY_PATH: string;
declare const ENTITY_LIST_COMPONENT: React.ComponentType<any>;
declare const NEW_ENTITY_COMPONENT: React.ComponentType<any>;
declare const ENTITY_COMPONENT: React.ComponentType<any>;

export const COMPONENT_NAME = (): React.ReactElement => {
  return (
    <Switch>
      <Route exact path={`${ENTITY_PATH}/`} component={ENTITY_LIST_COMPONENT} />
      <Route path={`${ENTITY_PATH}/new`} component={NEW_ENTITY_COMPONENT} />
      <Route path={`${ENTITY_PATH}/:id`} component={ENTITY_COMPONENT} />
    </Switch>
  );
};
