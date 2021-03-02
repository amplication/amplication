import { AppInfo } from "../../types";
import {
  createDescription,
  INSTRUCTIONS,
  INSTRUCTIONS_BUFFER,
} from "./create-swagger";

const EXAMPLE_DESCRIPTION = "EXAMPLE_DESCRIPTION";
const EXAMPLE_APP_INFO: AppInfo = {
  name: "EXAMPLE_NAME",
  version: "EXAMPLE_VERSION",
  description: EXAMPLE_DESCRIPTION,
  id: "EXAMPLE_ID",
  url: "EXAMPLE_URL",
};

describe("createDescription", () => {
  test("creates description correctly", async () => {
    expect(await createDescription(EXAMPLE_APP_INFO)).toEqual(
      [EXAMPLE_DESCRIPTION, INSTRUCTIONS].join(INSTRUCTIONS_BUFFER)
    );
  });
});
