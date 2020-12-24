import React, { useState, useMemo } from "react";
// @ts-ignore
import ReactCommandPalette from "react-command-palette";
// @ts-ignore
import { useQuery, gql } from "@apollo/client";
import { History } from "history";
import { Icon } from "@rmwc/icon";

import { useHistory, useRouteMatch } from "react-router-dom";
import { CircleBadge } from "@amplication/design-system";

import * as models from "../models";
import "./CommandPalette.scss";

export type AppDescriptor = Pick<models.App, "id" | "name" | "color">;
export type EntityDescriptor = Pick<models.Entity, "id" | "displayName">;
export type AppDescriptorWithEntityDescriptors = AppDescriptor & {
  entities: EntityDescriptor[];
};
export type TData = {
  apps: AppDescriptorWithEntityDescriptors[];
};

export interface Command {
  name: string;
  showAppData: boolean;
  isCurrentApp: boolean;
  type: string;
  appName?: string;
  appColor?: string;
  highlight?: string;
  command(): void;
}

const HOT_KEYS = ["command+shift+p", "ctrl+shift+p"];
/**
 * Wrapping with a class for testing purposes
 * @see https://github.com/asabaylus/react-command-palette/issues/520
 */
export class NavigationCommand implements Command {
  constructor(
    private readonly history: History,
    public readonly name: string,
    public readonly link: string,
    public readonly type: string,
    public readonly isCurrentApp: boolean,
    public readonly showAppData: boolean,
    public readonly appName?: string,
    public readonly appColor?: string
  ) {}
  command() {
    this.history.push(this.link);
  }
}

const TYPE_APP = "app";
const TYPE_ENTITY = "entity";
const TYPE_ROLES = "roles";

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
    type: TYPE_ENTITY,
  },
  {
    name: "Roles",
    link: "/:id/roles",
    type: TYPE_ROLES,
  },
];

const THEME = {
  modal: "command-palette__modal",
  overlay: "command-palette__overlay",
  container: "command-palette__container",
  header: "command-palette__header",
  content: "command-palette__content",
  containerOpen: "command-palette__container--open",
  input: "command-palette__input",
  inputOpen: "command-palette__input--open",
  inputFocused: "command-palette__input--focused",
  spinner: "command-palette__spinner",
  suggestionsContainer: "command-palette__suggestions-container",
  suggestionsContainerOpen: "command-palette__suggestions-container--Open",
  suggestionsList: "command-palette__suggestions-list",
  suggestion: "command-palette__suggestion",
  suggestionFirst: "command-palette__suggestion--first",
  suggestionHighlighted: "command-palette__suggestion--highlighted",
  trigger: "command-palette__trigger",
};

type Props = {
  trigger: React.ReactNode;
};

const CommandPalette = ({ trigger }: Props) => {
  const match = useRouteMatch<{ applicationId: string }>("/:applicationId/");

  const { applicationId } = match?.params || {};

  const history = useHistory();
  const [query, setQuery] = useState("");
  const handleChange = (inputValue: string, userQuery: string) => {
    setQuery(userQuery);
  };
  const { data } = useQuery<TData>(SEARCH, {
    variables: { query },
  });
  const commands = useMemo(
    () => (data ? getCommands(data, history, applicationId) : []),
    [data, history, applicationId]
  );

  return (
    <ReactCommandPalette
      trigger={trigger}
      commands={commands}
      onChange={handleChange}
      closeOnSelect
      showSpinnerOnSelect={false}
      theme={THEME}
      hotKeys={HOT_KEYS}
      options={{
        key: "name",
        keys: ["name", "appName"],
        allowTypo: true,
        scoreFn: calcCommandScore,
      }}
      renderCommand={CommandPaletteItem}
    />
  );
};

export default CommandPalette;

function CommandPaletteItem(suggestion: Command) {
  // A suggestion object will be passed to your custom component for each command
  const { appColor, appName, name, highlight, showAppData, type } = suggestion;
  return (
    <>
      {showAppData && (
        <>
          <CircleBadge name={appName || ""} color={appColor} />
          <span className="command-palette__app-name">{appName}</span>
        </>
      )}
      <Icon icon={type} />
      {highlight && highlight[0] ? (
        <span dangerouslySetInnerHTML={{ __html: highlight[0] }} />
      ) : (
        <span>{name}</span>
      )}
    </>
  );
}

export type CommandScoreType = {
  "0": {
    score: number;
  } | null;
  "1": {
    score: number;
  } | null;
  obj: NavigationCommand;
};

export function calcCommandScore(item: CommandScoreType): number {
  const command: NavigationCommand = item.obj;
  const scoreFactor = command.isCurrentApp ? 1000 : 0;

  return Math.max(
    item[0] ? item[0].score + scoreFactor : -1000,
    item[1] ? item[1].score + scoreFactor : -1000
  );
}

export function getStaticCommands(history: History): Command[] {
  return STATIC_COMMANDS.map(
    (command) =>
      new NavigationCommand(
        history,
        command.name,
        command.link,
        TYPE_APP,
        false,
        false
      )
  );
}

export function getAppCommands(
  app: AppDescriptor,
  history: History,
  isCurrentApp: boolean
): Command[] {
  const appCommand = new NavigationCommand(
    history,
    app.name,
    `/${app.id}`,
    TYPE_APP,
    isCurrentApp,
    true,
    app.name,
    app.color
  );
  const appCommands = APPLICATION_COMMANDS.map(
    (command) =>
      new NavigationCommand(
        history,
        command.name,
        command.link.replace(":id", app.id),
        command.type,
        isCurrentApp,
        true,
        app.name,
        app.color
      )
  );
  return [appCommand, ...appCommands];
}

export function getEntityCommands(
  entity: EntityDescriptor,
  app: AppDescriptor,
  history: History,
  isCurrentApp: boolean
): Command[] {
  return [
    new NavigationCommand(
      history,
      entity.displayName,
      `/${app.id}/entities/${entity.id}`,
      TYPE_ENTITY,
      isCurrentApp,
      true,
      app.name,
      app.color
    ),
  ];
}

export function getCommands(
  data: TData,
  history: History,
  currentAppId: string | undefined
): Command[] {
  const appCommands = data.apps.flatMap((app) => {
    const isCurrentApp = currentAppId === app.id;
    const appCommands = getAppCommands(app, history, isCurrentApp);
    const entityCommands = app.entities.flatMap((entity) =>
      getEntityCommands(entity, app, history, isCurrentApp)
    );
    return [...appCommands, ...entityCommands];
  });
  const staticCommands = getStaticCommands(history);
  return [...staticCommands, ...appCommands];
}

const SEARCH = gql`
  query search {
    apps {
      id
      name
      color
      entities {
        id
        displayName
      }
    }
  }
`;
