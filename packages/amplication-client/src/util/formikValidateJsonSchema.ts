import { FormikErrors } from "formik";
import Ajv from "ajv";
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
export function validate<T>(
  values: T,
  validationSchema: object
): FormikErrors<T> {
  const errors: FormikErrors<T> = {};

  const ajv = new Ajv({ allErrors: true });

  let isValid = ajv.validate(validationSchema, values);

  if (!isValid && ajv.errors) {
    for (const error of ajv.errors) {
      //remove the first dot from dataPath
      const fieldName = error.instancePath.substring(1).replaceAll("/", ".");
      set(errors, fieldName, error.message);
    }
  }

  return errors;
}
