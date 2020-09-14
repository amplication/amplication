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

export type AppDescriptor = Pick<models.App, "id" | "name">;
export type EntityDescriptor = Pick<models.Entity, "id" | "displayName">;
export type AppDescriptorWithEntityDescriptors = AppDescriptor & {
  entities: EntityDescriptor[];
};
export type TData = {
  apps: AppDescriptorWithEntityDescriptors[];
};

export interface Command {
  name: string;
  command(): void;
}

/**
 * Wrapping with a class for testing purposes
 * @see https://github.com/asabaylus/react-command-palette/issues/520
 */
export class NavigationCommand implements Command {
  constructor(
    private readonly history: History,
    public readonly name: string,
    public readonly link: string
  ) {}
  command() {
    this.history.push(this.link);
  }
}

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

export function getStaticCommands(history: History): Command[] {
  return STATIC_COMMANDS.map(
    (command) => new NavigationCommand(history, command.name, command.link)
  );
}

export function getAppCommands(
  app: AppDescriptor,
  history: History
): Command[] {
  const appCommand = new NavigationCommand(history, app.name, `/${app.id}`);
  const appCommands = APPLICATION_COMMANDS.map(
    (command) =>
      new NavigationCommand(
        history,
        [app.name, command.name].join(" | "),
        command.link.replace(":id", app.id)
      )
  );
  return [appCommand, ...appCommands];
}

export function getEntityCommands(
  entity: EntityDescriptor,
  app: AppDescriptor,
  history: History
): Command[] {
  return [
    new NavigationCommand(
      history,
      [app.name, entity.displayName].join(" | "),
      `/${app.id}/entities/${entity.id}`
    ),
  ];
}

export function getCommands(data: TData, history: History): Command[] {
  const appCommands = data.apps.flatMap((app) => {
    const appCommands = getAppCommands(app, history);
    const entityCommands = app.entities.flatMap((entity) =>
      getEntityCommands(entity, app, history)
    );
    return [...appCommands, ...entityCommands];
  });
  const staticCommands = getStaticCommands(history);
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
