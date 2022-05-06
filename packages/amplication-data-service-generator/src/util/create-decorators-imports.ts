import { namedTypes } from "ast-types";
import { PUBLIC_ID } from "./create-public-decorator";

export const IMPORTABLE_DECORATORS_NAMES: Record<
  string,
  namedTypes.Identifier[]
> = {
  "../../decorators/public.decorator": [PUBLIC_ID],
};
