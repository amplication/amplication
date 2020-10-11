import { createMemoryHistory } from "history";
import {
  Command,
  getCommands,
  getStaticCommands,
  TData,
  AppDescriptorWithEntityDescriptors,
  getAppCommands,
  EntityDescriptor,
  getEntityCommands,
  calcCommandScore,
  CommandScoreType,
  NavigationCommand,
} from "./CommandPalette";

const EXAMPLE_ANOTHER_APP_ID = "EXAMPLE_ANOTHER_APP_ID";

const IS_IN_CURRENT_APP = true;
const IS_NOT_IN_CURRENT_APP = false;

const EXAMPLE_APP: AppDescriptorWithEntityDescriptors = {
  id: "EXAMPLE_APP_ID",
  name: "Example App Name",
  color: "#FFFFFF",
  entities: [],
};

const EXAMPLE_ENTITY: EntityDescriptor = {
  id: "EXAMPLE_ENTITY_ID",
  displayName: "Example Entity Display Name",
};

const EXAMPLE_APP_WITH_ENTITY: AppDescriptorWithEntityDescriptors = {
  ...EXAMPLE_APP,
  entities: [EXAMPLE_ENTITY],
};

describe("getCommands", () => {
  const history = createMemoryHistory();
  const cases: Array<[string, TData, Command[], string]> = [
    ["Empty data", { apps: [] }, getStaticCommands(history), EXAMPLE_APP.id],
    [
      "Single app",
      { apps: [EXAMPLE_APP] },
      [
        ...getStaticCommands(history),
        ...getAppCommands(EXAMPLE_APP, history, true),
      ],
      EXAMPLE_APP.id,
    ],
    [
      "Single app with single entity",
      { apps: [EXAMPLE_APP_WITH_ENTITY] },
      [
        ...getStaticCommands(history),
        ...getAppCommands(EXAMPLE_APP_WITH_ENTITY, history, true),
        ...getEntityCommands(
          EXAMPLE_ENTITY,
          EXAMPLE_APP_WITH_ENTITY,
          history,
          true
        ),
      ],
      EXAMPLE_APP.id,
    ],
    [
      "Single app with single entity, not current app",
      { apps: [EXAMPLE_APP_WITH_ENTITY] },
      [
        ...getStaticCommands(history),
        ...getAppCommands(EXAMPLE_APP_WITH_ENTITY, history, false),
        ...getEntityCommands(
          EXAMPLE_ENTITY,
          EXAMPLE_APP_WITH_ENTITY,
          history,
          false
        ),
      ],
      EXAMPLE_ANOTHER_APP_ID,
    ],
  ];
  test.each(cases)("%s", (name, data, expected, appId) => {
    expect(getCommands(data, history, appId)).toEqual(expected);
  });
});

describe("calcCommandScore", () => {
  const history = createMemoryHistory();

  const commandNotInCurrentApp = new NavigationCommand(
    history,
    "ExampleCommandName",
    "ExampleCommandLink",
    "ExampleType",
    IS_NOT_IN_CURRENT_APP,
    false
  );

  const commandInCurrentApp = new NavigationCommand(
    history,
    "ExampleCommandName",
    "ExampleCommandLink",
    "ExampleType",
    IS_IN_CURRENT_APP,
    false
  );

  const cases: Array<[string, CommandScoreType, number]> = [
    [
      "Return min value",
      {
        "0": null,
        "1": null,
        obj: commandNotInCurrentApp,
      },
      -1000,
    ],
    [
      "Returns max score with factor",
      {
        "0": {
          score: 80,
        },
        "1": {
          score: 100,
        },
        obj: commandInCurrentApp,
      },
      1100,
    ],
    [
      "Returns max score without factor",
      {
        "0": {
          score: 80,
        },
        "1": {
          score: 100,
        },
        obj: commandNotInCurrentApp,
      },
      100,
    ],
  ];
  test.each(cases)("%s", (name, item, expected) => {
    expect(calcCommandScore(item)).toEqual(expected);
  });
});
