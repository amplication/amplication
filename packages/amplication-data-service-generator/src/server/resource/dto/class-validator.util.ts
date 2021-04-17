import { builders } from "ast-types";

export const CLASS_VALIDATOR_MODULE = "class-validator";
export const IS_BOOLEAN_ID = builders.identifier("IsBoolean");
export const IS_DATE_ID = builders.identifier("IsDate");
export const IS_NUMBER_ID = builders.identifier("IsNumber");
export const IS_INT_ID = builders.identifier("IsInt");
export const IS_STRING_ID = builders.identifier("IsString");
export const IS_JSON_ID = builders.identifier("IsJSON");
export const IS_OPTIONAL_ID = builders.identifier("IsOptional");
export const IS_ENUM_ID = builders.identifier("IsEnum");
export const VALIDATE_NESTED_ID = builders.identifier("ValidateNested");
