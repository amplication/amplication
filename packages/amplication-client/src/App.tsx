import React, { useMemo, useCallback, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { sortBy } from "lodash";

import ApplicationLayout from "./Application/ApplicationLayout";
import NewApplication from "./Application/NewApplication";
import Login from "./User/Login";
import Signup from "./User/Signup";
import Applications from "./Application/Applications";
import User from "./User/User";

import PrivateRoute from "./authentication/PrivateRoute";
import BreadcrumbsContext, {
  BreadcrumbItem,
} from "./Layout/BreadcrumbsContext";

const { NODE_ENV } = process.env;

function App() {
  const history = useHistory();
  if (NODE_ENV === "development") {
    history.listen((...args) => {
      console.debug("History: ", ...args);
    });
  }

  const [breadcrumbsItems, setBreadcrumbsItems] = useState<BreadcrumbItem[]>(
    []
  );

  const registerBreadcrumbItem = useCallback(
    (addItem: BreadcrumbItem) => {
      setBreadcrumbsItems((items) => {
        return sortBy(
          [...items.filter((item) => item.url !== addItem.url), addItem],
          (sortItem) => sortItem.url
        );
      });
    },
    [setBreadcrumbsItems]
  );

  const unregisterBreadcrumbItem = useCallback(
    (url: string) => {
      console.log("remove", url);
      setBreadcrumbsItems((items) => {
        return sortBy(
          items.filter((item) => item.url !== url),
          (sortItem) => sortItem.url
        );
      });
    },
    [setBreadcrumbsItems]
  );

  const breadcrumbsContextValue = useMemo(
    () => ({
      breadcrumbsItems,
      registerItem: registerBreadcrumbItem,
      unregisterItem: unregisterBreadcrumbItem,
    }),
    [breadcrumbsItems, registerBreadcrumbItem, unregisterBreadcrumbItem]
  );

  return (
    <>
      {/* <Header />
      <TopAppBarFixedAdjust /> */}
      <BreadcrumbsContext.Provider value={breadcrumbsContextValue}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/me">
            <User />
          </PrivateRoute>
          <PrivateRoute exact path="/" component={Applications} />
          <PrivateRoute path="/new" component={NewApplication} />
          <PrivateRoute path="/:application" component={ApplicationLayout} />
        </Switch>
      </BreadcrumbsContext.Provider>
    </>
  );
}

export default App;
