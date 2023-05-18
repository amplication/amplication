import React from "react";
import { Switch, Route, match } from "react-router-dom";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";

import "./Entities.scss";

import Entity from "../Entity/Entity";
import EntityList from "./EntityList";

type Props = {
  match: match;
};

function Entities({ match }: Props) {
  return (
    <Switch>
      <RouteWithAnalytics
        exact
        path="/:workspace/:project/:resource/entities/"
        component={EntityList}
      />
      <Route
        path="/:workspace/:project/:resource/entities/:entityId"
        component={Entity}
      />
    </Switch>
  );
}

export default Entities;
