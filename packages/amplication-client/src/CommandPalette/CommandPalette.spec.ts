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

const EXAMPLE_APP: AppDescriptorWithEntityDescriptors = {
  id: "EXAMPLE_APP_ID",
  name: "Example App Name",
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
  const cases: Array<[string, TData, Command[]]> = [
    ["Empty data", { apps: [] }, getStaticCommands(history)],
    [
      "Single app",
      { apps: [EXAMPLE_APP] },
      [...getStaticCommands(history), ...getAppCommands(EXAMPLE_APP, history)],
    ],
    [
      "Single app with single entity",
      { apps: [EXAMPLE_APP_WITH_ENTITY] },
      [
        ...getStaticCommands(history),
        ...getAppCommands(EXAMPLE_APP_WITH_ENTITY, history),
        ...getEntityCommands(EXAMPLE_ENTITY, EXAMPLE_APP_WITH_ENTITY, history),
      ],
    ],
  ];
  test.each(cases)("%s", (name, data, expected) => {
    expect(getCommands(data, history)).toEqual(expected);
  });
});
