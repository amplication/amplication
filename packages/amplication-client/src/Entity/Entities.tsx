import React from "react";
import { Switch, Route, match } from "react-router-dom";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";

import { EntityList } from "./EntityList";
import "./Entities.scss";

import Entity from "../Entity/Entity";

type Props = {
  match: match;
};

function Entities({ match }: Props) {
  return (
    <Switch>
      <RouteWithAnalytics
        exact
        path="/:application/entities/"
        component={EntityList}
      />
      <Route path="/:application/entities/:entityId" component={Entity} />
    </Switch>
  );
}

export default Entities;
