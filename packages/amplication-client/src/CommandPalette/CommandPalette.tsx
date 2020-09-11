import React, { useState, useMemo } from "react";
// @ts-ignore
import ReactCommandPalette from "react-command-palette";
// @ts-ignore
import sublimeTheme from "react-command-palette/themes/sublime-theme";
import "react-command-palette/themes/sublime.css";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { History } from "history";
import { useHistory } from "react-router-dom";
import * as models from "../models";

type AppDescriptor = Pick<models.App, "id" | "name">;
type EntityDescriptor = Pick<models.Entity, "id" | "displayName">;
type TData = {
  apps: Array<AppDescriptor & { entities: EntityDescriptor[] }>;
};
type Command = {
  name: string;
  command: () => void;
};

const STATIC_COMMANDS = [
  {
    name: "Applications",
    link: "/",
  },
];

const APPLICATION_COMMANDS = [
  {
    name: "Entities",
    link: "/:id/entities",
  },
  {
    name: "Publish",
    link: "/:id/publish",
  },
  {
    name: "Settings",
    link: "/:id/settings",
  },
];

const CommandPalette = () => {
  const history = useHistory();
  const [query, setQuery] = useState("");
  const handleChange = (inputValue: string, userQuery: string) => {
    setQuery(userQuery);
  };
  const { data } = useQuery<TData>(SEARCH, {
    variables: { query },
  });
  const commands = useMemo(() => (data ? getCommands(data, history) : []), [
    data,
    history,
  ]);
  return (
    <ReactCommandPalette
      commands={commands}
      onChange={handleChange}
      closeOnSelect
      showSpinnerOnSelect={false}
      theme={sublimeTheme}
    />
  );
};

export default CommandPalette;

function getCommands(data: TData, history: History): Command[] {
  const go = (link: string) => () => history.push(link);
  const appCommands = data.apps.flatMap((app) => {
    const staticAppCommands = APPLICATION_COMMANDS.map((command) => ({
      name: [app.name, command.name].join(" | "),
      command: go(command.link.replace(":id", app.id)),
    }));
    const entityCommands = app.entities.map((entity) => ({
      name: [app.name, entity.displayName].join(" | "),
      command: go(`/${app.id}/entities/${entity.id}`),
    }));
    return [...staticAppCommands, ...entityCommands];
  });
  const staticCommands = STATIC_COMMANDS.map((command) => ({
    name: command.name,
    command: go(command.link),
  }));
  return [...staticCommands, ...appCommands];
}

const SEARCH = gql`
  query($query: String!) {
    apps {
      id
      name
      entities(
        where: { displayName: { contains: $query, mode: Insensitive } }
        take: 10
      ) {
        id
        displayName
      }
    }
  }
`;
