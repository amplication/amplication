import React from "react";
import { Switch, Route, match } from "react-router-dom";

import { EntityList } from "./EntityList";
import "./Entities.scss";

import Entity from "../Entity/Entity";
import useBreadcrumbs from "../Layout/use-breadcrumbs";

function Entities({ match }: { match: match }) {
  useBreadcrumbs(match.url, "Entities");

  return (
    <Switch>
      <Route exact path="/:application/entities/" component={EntityList} />
      <Route path="/:application/entities/:entityId" component={Entity} />
    </Switch>
  );
}

export default Entities;
