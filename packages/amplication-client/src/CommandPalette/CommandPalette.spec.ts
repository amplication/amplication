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
} from "./CommandPalette";

const EXAMPLE_ANOTHER_APP_ID = "EXAMPLE_ANOTHER_APP_ID";

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
