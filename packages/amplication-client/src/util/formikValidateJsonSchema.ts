import { FormikErrors } from "formik";
import Ajv from "ajv";
import { set } from "lodash";

/**
 * A function to validate a form based on a given JSON Schema.
 * The function returns a FormikErrors object.
 * When using formik validation, do no use any DOM validation attributes to avoid the default browser validation and error messages
 *
 * Example usage:
 *
 * <Formik
 *      initialValues={INITIAL_VALUES}
 *      validate={(values: ValuesType) => {
 *        return validate<ValuesType>(values, FORM_SCHEMA);
 *      }}
 *      onSubmit={handleSubmit}
 *    >
 *
 * @param values
 * The data to be validated
 * @param validationSchema
 * The JSON schema for validation
 *  */
export function validate<T>(
  values: T,
  validationSchema: object
): FormikErrors<T> {
  const errors: FormikErrors<T> = {};

  const ajv: Ajv.Ajv = new Ajv({ allErrors: true });

  let isValid = ajv.validate(validationSchema, values);

  if (!isValid && ajv.errors) {
    for (const error of ajv.errors) {
      const fieldName = error.dataPath.substring(1);
      set(errors, fieldName, error.message);
    }
  }

  return errors;
}
