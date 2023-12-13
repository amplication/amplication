import Ajv from "ajv";
import ajvErrors from "ajv-errors";
import { FormikErrors } from "formik";
import { set } from "lodash";

/**
 * A function to validate a form based on a given JSON Schema.
 * When using formik validation, do no use any DOM validation attributes to avoid the default browser validation and error messages

 * @param values
 * The data to be validated
 * @param validationSchema
 * The JSON schema for validation
 * @returns
 * FormikErrors object
 * @example
 *   <Formik
 *      initialValues={INITIAL_VALUES}
 *      validate={(values: ValuesType) => {
 *        return validate<ValuesType>(values, FORM_SCHEMA);
 *      }}
 *      onSubmit={handleSubmit}
 *    >
 *  */

export const validationErrorMessages = {
  AT_LEAST_TWO_CHARARCTERS: "Must be at least 2 characters long",
  NO_SYMBOLS_ERROR: "Unsupported character",
  AT_MOST_SIXTY_CHARACTERS: "Must be at most 60 characters long",
};

export function validate<T>(
  values: T,
  validationSchema: { [key: string]: any }
): FormikErrors<T> {
  const errors: FormikErrors<T> = {};

  const ajv = new Ajv({ allErrors: true });
  ajvErrors(ajv);

  const isValid = ajv.validate(validationSchema, values);

  const { minimumValue, maximumValue } = values as unknown as {
    minimumValue: number;
    maximumValue: number;
  };
  if (minimumValue && minimumValue >= maximumValue) {
    set(
      errors,
      "minimumValue",
      "Minimum value can not be greater than, or equal to, the Maximum value"
    );
  }

  if (!isValid && ajv.errors) {
    for (const error of ajv.errors) {
      // remove the first dot from dataPath
      const fieldName = error.dataPath.substring(1).replaceAll("/", ".");
      set(errors, fieldName, error.message);
    }
  }

  return errors;
}
