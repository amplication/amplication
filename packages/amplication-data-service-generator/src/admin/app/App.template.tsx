import React, { useEffect, useState } from "react";
import { Admin, DataProvider, Resource } from "react-admin";
//@ts-ignore
import buildGraphQLProvider from "./data-provider/graphqlDataProvider";
//@ts-ignore
import basicHttpAuthProvider from "./auth-provider/ra-auth-basic-http";

import "./App.scss";
//@ts-ignore
import Dashboard from "./pages/Dashboard";

declare const RESOURCES: React.ReactElement[];

const App = (): React.ReactElement => {
  const [dataProvider, setDataProvider] = useState<DataProvider | null>(null);
  useEffect(() => {
    buildGraphQLProvider
      .then((provider: any) => {
        setDataProvider(() => provider);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);
  if (!dataProvider) {
    return <div>Loading</div>;
  }
  return (
    <div className="App">
      <Admin
        title="My Custom Admin"
        dataProvider={dataProvider}
        authProvider={basicHttpAuthProvider}
        dashboard={Dashboard}
      >
        {RESOURCES}
      </Admin>
    </div>
  );
};

export default App;
