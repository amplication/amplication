import { builders } from "ast-types";

export const CLASS_VALIDATOR_MODULE = "class-validator";
export const CLASS_VALIDATOR_CUSTOM_VALIDATORS_MODULE = "../../validators";
export const IS_BOOLEAN_ID = builders.identifier("IsBoolean");
export const IS_DATE_ID = builders.identifier("IsDate");
export const IS_NUMBER_ID = builders.identifier("IsNumber");
export const IS_INT_ID = builders.identifier("IsInt");
export const IS_STRING_ID = builders.identifier("IsString");
export const IS_JSON_VALUE_ID = builders.identifier("IsJSONValue");
export const IS_OPTIONAL_ID = builders.identifier("IsOptional");
export const IS_ENUM_ID = builders.identifier("IsEnum");
export const MIN_ID = builders.identifier("Min");
export const MAX_ID = builders.identifier("Max");
export const MAX_LENGTH_ID = builders.identifier("MaxLength");
export const VALIDATE_NESTED_ID = builders.identifier("ValidateNested");
