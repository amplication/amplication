import * as PrismaSchemaDSL from "prisma-schema-dsl";

/**
 *
 */
export const USER_MODEL = PrismaSchemaDSL.createModel("User", [
  PrismaSchemaDSL.createScalarField(
    "username",
    PrismaSchemaDSL.ScalarType.String,
    false,
    true,
    true
  ),
  PrismaSchemaDSL.createScalarField(
    "password",
    PrismaSchemaDSL.ScalarType.String,
    false,
    true
  ),
  PrismaSchemaDSL.createScalarField(
    "roles",
    PrismaSchemaDSL.ScalarType.String,
    true,
    true
  ),
]);
