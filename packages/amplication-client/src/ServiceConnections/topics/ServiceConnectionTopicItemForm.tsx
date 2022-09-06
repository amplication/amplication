import {
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import { Formik } from "formik";
import React, { useMemo } from "react";
import { Form } from "../../Components/Form";
import { EnumMessagePatternConnectionOptions } from "../../models";
import FormikAutoSave from "../../util/formikAutoSave";
import { validate } from "../../util/formikValidateJsonSchema";

export type FormValues = {
  patternType: EnumMessagePatternConnectionOptions;
  topicId: string;
};

type Props = {
  onSubmit: (values: FormValues) => void;
  existingPattern?: EnumMessagePatternConnectionOptions;
  topicId: string;
};

export const INITIAL_VALUES: EnumMessagePatternConnectionOptions =
  EnumMessagePatternConnectionOptions.None;

const FORM_SCHEMA = {
  required: ["patternType"],
  properties: {
    patternType: {
      type: "string",
    },
  },
};

export default function ServiceConnectionTopicItemForm({
  onSubmit,
  existingPattern,
  topicId,
}: Props) {
  const initialValues = useMemo(() => {
    return { patternType: existingPattern || INITIAL_VALUES, topicId };
  }, [existingPattern, topicId]);

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => validate(values, FORM_SCHEMA)}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form childrenAsBlocks>
          <>
            <FormikAutoSave debounceMS={1000} />
            <SelectMenu title={values.patternType}>
              <SelectMenuModal>
                <SelectMenuList>
                  <>
                    {Object.keys(EnumMessagePatternConnectionOptions).map(
                      (connectionOption, i) => (
                        <SelectMenuItem
                          closeAfterSelectionChange
                          selected={values.patternType === connectionOption}
                          key={i}
                          onSelectionChange={() => {
                            setFieldValue("patternType", connectionOption);
                          }}
                        >
                          {connectionOption}
                        </SelectMenuItem>
                      )
                    )}
                  </>
                </SelectMenuList>
              </SelectMenuModal>
            </SelectMenu>
          </>
        </Form>
      )}
    </Formik>
  );
}
