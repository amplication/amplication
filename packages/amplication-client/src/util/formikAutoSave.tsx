import React, { useState, useEffect, useCallback } from "react";
import { useFormikContext } from "formik";
import debounce from "lodash.debounce";

type Props = {
  debounceMS: number;
  onError?: (error: Error) => void;
};

const FormikAutoSave = ({ debounceMS = 1000, onError }: Props) => {
  const formik = useFormikContext();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const debouncedSubmit = useCallback(
    debounce(() => {
      return formik
        .submitForm()
        .then(() => setIsSaved(true))
        .catch(onError);
    }, debounceMS),
    [formik.submitForm, debounceMS]
  );

  useEffect(() => {
    if (formik.dirty) {
      debouncedSubmit();
    }
  }, [debouncedSubmit, formik.values, formik.dirty]);

  return null;
};

export default FormikAutoSave;
