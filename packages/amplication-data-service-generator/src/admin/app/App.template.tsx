import React from "react";
import { Route, Switch } from "react-router-dom";
// @ts-ignore
import Navigation from "./Navigation";

declare const ROUTES: React.ReactNode[];

function App() {
  return (
    <div>
      <Navigation />
      <Switch>{ROUTES}</Switch>
    </div>
  );
}

export default App;
