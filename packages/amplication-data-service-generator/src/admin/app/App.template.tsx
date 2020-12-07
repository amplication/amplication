import React, { useCallback } from "react";
import { Route, Switch, useHistory, Link } from "react-router-dom";
// @ts-ignore
import Navigation from "./Navigation";
// @ts-ignore
import Login from "./Login";
// @ts-ignore
import { Credentials, setCredentials, removeCredentials } from "./auth";
import {
  Menu,
  MainLayout,
  Page,
  CircleBadge,
} from "@amplication/design-system";

declare const ROUTES: React.ReactElement[];
declare const APP_NAME: string;

const App = (): React.ReactElement => {
  const history = useHistory();
  const handleLogin = useCallback(
    (credentials: Credentials) => {
      setCredentials(credentials);
      history.push("/");
    },
    [history]
  );

  return (
    <MainLayout>
      <Switch>
        <Route path="/login" render={() => <Login onLogin={handleLogin} />} />
        <Route path="/" component={AppLayout} />
      </Switch>
    </MainLayout>
  );
};

export default App;

/**@todo: move to a separate template file */
const AppLayout = (): React.ReactElement => {
  const history = useHistory();
  const signOut = useCallback(() => {
    removeCredentials();
    history.push("/login");
  }, [history]);

  return (
    <>
      <Menu
        onSignOutClick={signOut}
        logoContent={
          <Link to="/">
            <CircleBadge name={APP_NAME} />
          </Link>
        }
      ></Menu>
      <MainLayout.Content>
        <Page>
          <Switch>
            <Route exact path="/" component={Navigation} />
            {ROUTES}
          </Switch>
        </Page>
      </MainLayout.Content>
    </>
  );
};
