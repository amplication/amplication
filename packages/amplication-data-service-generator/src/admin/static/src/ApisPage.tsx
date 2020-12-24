import React from "react";
import { Panel, PanelHeader, EnumPanelStyle } from "@amplication/design-system";
import "./ApisPage.scss";

const ApisPage = () => {
  return (
    <div className="api-page">
      <div className="api-page__header">
        Congratulations. Your application is available with REST API and GraphQL
        API.
      </div>
      <div className="api-page__body">
        <Panel panelStyle={EnumPanelStyle.Bordered}>
          <PanelHeader>REST API</PanelHeader>
          <div className="message">
            <p>
              Use the following link to open the swagger documentation of the
              REST API.
            </p>
            <p>
              <a href="/api">REST API Docs (swagger)</a>
            </p>
            <h3>Authentication</h3>
            <p>
              Click the "Authorize" button in the swagger docs page to
              authenticate.
            </p>
          </div>
        </Panel>
        <Panel panelStyle={EnumPanelStyle.Bordered}>
          <PanelHeader>GraphQL API</PanelHeader>
          <div className="message">
            <p>Use the following link to open the GraphQL Playground.</p>
            <p>
              <a href="/graphql">GraphQL Playground</a>
            </p>
            <h3>Authentication</h3>
            <p>
              For authentication you need to add the Basic authentication
              header.
            </p>
            <p>
              The following example adds the Basic authentication header for the
              default user with username "admin" and password "admin".
            </p>
            <p>
              Copy the header with the curley braces and paste it to the "HTTP
              HEADERS" panel in the graphQL Playground.
            </p>

            <pre className="code-sample">
              {`{
  "Authorization": "Basic YWRtaW46YWRtaW4="
}`}
            </pre>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default ApisPage;
