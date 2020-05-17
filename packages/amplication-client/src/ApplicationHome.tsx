import React, { useState, useCallback } from "react";
import { match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { TabBar, Tab } from "@rmwc/tabs";
import "@rmwc/tabs/styles";
// import { Card } from "@rmwc/card";
// import {
//   DataTable,
//   DataTableContent,
//   DataTableHead,
//   DataTableRow,
//   DataTableHeadCell,
//   DataTableBody,
//   DataTableCell,
// } from "@rmwc/data-table";
import "./ApplicationHome.css";

type Props = {
  match: match<{ application: string }>;
};

function ApplicationHome({ match }: Props) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const handleActivate = useCallback(
    (event) => {
      setActiveTabIndex(event.detail.index);
    },
    [setActiveTabIndex]
  );
  const { data, loading } = useQuery(GET_APPLICATION, {
    variables: {
      id: match.params.application,
    },
  });

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <main className="application-home">
      <header>
        <h1>{data?.app.name}</h1>
        <p>{data?.app.description}</p>
        <TabBar activeTabIndex={activeTabIndex} onActivate={handleActivate}>
          <Tab>Versions</Tab>
          <Tab>Environment</Tab>
        </TabBar>
      </header>
    </main>
  );

  // return (
  //   <main className="application-home">
  //     <header>
  //       <h1>{data.apps.name}</h1>
  //       <p>{data.apps.description}</p>
  //       <TabBar activeTabIndex={activeTabIndex} onActivate={handleActivate}>
  //         <Tab>Versions</Tab>
  //         <Tab>Environment</Tab>
  //       </TabBar>
  //     </header>
  //     {activeTabIndex === 0 && (
  //       <Card>
  //         <DataTable>
  //           <DataTableContent>
  //             <DataTableHead>
  //               <DataTableRow>
  //                 <DataTableHeadCell>Version</DataTableHeadCell>
  //                 <DataTableHeadCell>Date</DataTableHeadCell>
  //                 <DataTableHeadCell>Description</DataTableHeadCell>
  //               </DataTableRow>
  //             </DataTableHead>
  //             <DataTableBody>
  //               {data.apps.versions.map((version) => {
  //                 return (
  //                   <DataTableRow>
  //                     <DataTableCell>{version.id}</DataTableCell>
  //                     <DataTableCell>
  //                       {version.date.toLocaleDateString()}
  //                     </DataTableCell>
  //                     <DataTableCell>{version.description}</DataTableCell>
  //                   </DataTableRow>
  //                 );
  //               })}
  //             </DataTableBody>
  //           </DataTableContent>
  //         </DataTable>
  //       </Card>
  //     )}
  //     {activeTabIndex === 1 &&
  //       app.environments.map((environment) => (
  //         <div>
  //           <h2>{environment.name}</h2>
  //           {environment.versions.map((version) => (
  //             <div>
  //               {version.id} {version.date.toLocaleDateString()}{" "}
  //               {version.description}
  //             </div>
  //           ))}
  //         </div>
  //       ))}
  //   </main>
  // );
}

export default ApplicationHome;

const GET_APPLICATION = gql`
  query getApplication($id: String!) {
    app(where: { id: $id }) {
      id
      name
      description
    }
  }
`;
