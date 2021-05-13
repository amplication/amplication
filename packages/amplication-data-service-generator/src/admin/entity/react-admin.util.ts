import { builders } from "ast-types";

export const REACT_ADMIN_MODULE = "react-admin";

export const REACT_ADMIN_COMPONENTS_ID = [
  builders.identifier("TextInput"),
  builders.identifier("DateInput"),
  builders.identifier("NumberInput"),
  builders.identifier("ReferenceInput"),
  builders.identifier("SelectInput"),

  builders.identifier("SelectArrayInput"),
  builders.identifier("PasswordInput"),

  builders.identifier("TextField"),
  builders.identifier("DateField"),
  builders.identifier("NumberField"),
  builders.identifier("ReferenceField"),
  builders.identifier("BooleanField"),
];
