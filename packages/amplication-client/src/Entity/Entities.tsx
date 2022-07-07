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
        path="/:resource/entities/"
        component={EntityList}
      />
      <Route path="/:resource/entities/:entityId" component={Entity} />
    </Switch>
  );
}

export default Entities;
