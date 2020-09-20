import * as PrismaSchemaDSL from "prisma-schema-dsl";

export const USER_MODEL_AUTH_FIELDS = [
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
];

export const USER_MODEL = PrismaSchemaDSL.createModel("User", [
  PrismaSchemaDSL.createScalarField(
    "id",
    PrismaSchemaDSL.ScalarType.String,
    false,
    true,
    false,
    true,
    false,
    new PrismaSchemaDSL.CallExpression("cuid")
  ),
  ...USER_MODEL_AUTH_FIELDS,
]);
