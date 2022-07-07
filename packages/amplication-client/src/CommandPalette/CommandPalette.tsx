import React, { useState, useMemo } from "react";
// @ts-ignore
import ReactCommandPalette from "react-command-palette";
// @ts-ignore
import { useQuery, gql } from "@apollo/client";
import { History } from "history";

import { useHistory, useRouteMatch } from "react-router-dom";
import { CircleBadge, Icon } from "@amplication/design-system";

import * as models from "../models";
import "./CommandPalette.scss";

export type ResourceDescriptor = Pick<models.Resource, "id" | "name" | "color">;
export type EntityDescriptor = Pick<models.Entity, "id" | "displayName">;
export type ResourceDescriptorWithEntityDescriptors = ResourceDescriptor & {
  entities: EntityDescriptor[];
};
export type TData = {
  resources: ResourceDescriptorWithEntityDescriptors[];
};

export interface Command {
  name: string;
  showResourceData: boolean;
  isCurrentResource: boolean;
  type: string;
  resourceName?: string;
  resourceColor?: string;
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
    public readonly isCurrentResource: boolean,
    public readonly showResourceData: boolean,
    public readonly resourceName?: string,
    public readonly resourceColor?: string
  ) {}
  command() {
    this.history.push(this.link);
  }
}

const TYPE_RESOURCE = "resource";
const TYPE_ENTITY = "entity";
const TYPE_ROLES = "roles";

const STATIC_COMMANDS = [
  {
    name: "Resources",
    link: "/",
  },
];

const RESOURCE_COMMANDS = [
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
  const match = useRouteMatch<{ resourceId: string }>("/:resourceId/");

  const { resourceId } = match?.params || {};

  const history = useHistory();
  const [query, setQuery] = useState("");
  const handleChange = (inputValue: string, userQuery: string) => {
    setQuery(userQuery);
  };
  const { data } = useQuery<TData>(SEARCH, {
    variables: { query },
  });
  const commands = useMemo(
    () => (data ? getCommands(data, history, resourceId) : []),
    [data, history, resourceId]
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
        keys: ["name", "resourceName"],
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
  const {
    resourceColor,
    resourceName,
    name,
    highlight,
    showResourceData,
    type,
  } = suggestion;
  return (
    <>
      {showResourceData && (
        <>
          <CircleBadge name={resourceName || ""} color={resourceColor} />
          <span className="command-palette__resource-name">{resourceName}</span>
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
  const scoreFactor = command.isCurrentResource ? 1000 : 0;

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
        TYPE_RESOURCE,
        false,
        false
      )
  );
}

export function getResourceCommands(
  resource: ResourceDescriptor,
  history: History,
  isCurrentResource: boolean
): Command[] {
  const resourceCommand = new NavigationCommand(
    history,
    resource.name,
    `/${resource.id}`,
    TYPE_RESOURCE,
    isCurrentResource,
    true,
    resource.name,
    resource.color
  );
  const resourceCommands = RESOURCE_COMMANDS.map(
    (command) =>
      new NavigationCommand(
        history,
        command.name,
        command.link.replace(":id", resource.id),
        command.type,
        isCurrentResource,
        true,
        resource.name,
        resource.color
      )
  );
  return [resourceCommand, ...resourceCommands];
}

export function getEntityCommands(
  entity: EntityDescriptor,
  resource: ResourceDescriptor,
  history: History,
  isCurrentResource: boolean
): Command[] {
  return [
    new NavigationCommand(
      history,
      entity.displayName,
      `/${resource.id}/entities/${entity.id}`,
      TYPE_ENTITY,
      isCurrentResource,
      true,
      resource.name,
      resource.color
    ),
  ];
}

export function getCommands(
  data: TData,
  history: History,
  currentResourceId: string | undefined
): Command[] {
  const resourceCommands = data.resources.flatMap((resource) => {
    const isCurrentResource = currentResourceId === resource.id;
    const resourceCommands = getResourceCommands(
      resource,
      history,
      isCurrentResource
    );
    const entityCommands = resource.entities.flatMap((entity) =>
      getEntityCommands(entity, resource, history, isCurrentResource)
    );
    return [...resourceCommands, ...entityCommands];
  });
  const staticCommands = getStaticCommands(history);
  return [...staticCommands, ...resourceCommands];
}

const SEARCH = gql`
  query search {
    resources {
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
