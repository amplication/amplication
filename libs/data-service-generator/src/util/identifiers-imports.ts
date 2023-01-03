import { namedTypes, builders } from "ast-types";
import { PUBLIC_ID } from "./create-public-decorator";
import {
  ACL_FILTER_RESPONSE_INTERCEPTOR_NAME,
  ACL_VALIDATE_REQUEST_INTERCEPTOR_NAME,
} from "./set-endpoint-permission";

export const IMPORTABLE_IDENTIFIERS_NAMES: Record<
  string,
  namedTypes.Identifier[]
> = {
  "../../decorators/public.decorator": [PUBLIC_ID],
  "../../interceptors/aclFilterResponse.interceptor": [
    builders.identifier(ACL_FILTER_RESPONSE_INTERCEPTOR_NAME),
  ],
  "../../interceptors/aclValidateRequest.interceptor": [
    builders.identifier(ACL_VALIDATE_REQUEST_INTERCEPTOR_NAME),
  ],
};
