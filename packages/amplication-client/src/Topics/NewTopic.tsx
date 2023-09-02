import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { gql, useMutation, Reference } from "@apollo/client";
import { Formik, Form } from "formik";
import { isEmpty } from "lodash";
import classNames from "classnames";
import { Snackbar, TextField } from "@amplication/ui/design-system";
import { formatError } from "../util/error";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { validate } from "../util/formikValidateJsonSchema";
import "./NewTopic.scss";
import { AppContext } from "../context/appContext";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";

const INITIAL_VALUES: Partial<models.Topic> = {
  name: "",
  displayName: "",
  description: "",
};

type Props = {
  resourceId: string;
  onTopicAdd?: (topic: models.Topic) => void;
};

const FORM_SCHEMA = {
  required: ["displayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 1,
      maxLength: 249,
    },
  },
};
const CLASS_NAME = "new-topic";

const prepareName = (displayName: string) => {
  return displayName
    .toLowerCase() // Convert to lowercase
    .replace(/[ ]/g, ".") // Replace spaces with dots
    .replace(/[^a-zA-Z0-9._-]/g, ""); // Remove all non-legit characters
};

const NewTopic = ({ onTopicAdd, resourceId }: Props) => {
  const { trackEvent } = useTracking();
  const { addEntity } = useContext(AppContext);

  const [createTopic, { error, loading }] = useMutation(CREATE_TOPIC, {
    update(cache, { data }) {
      if (!data) {
        return;
      }

      const newTopic = data.createTopic;

      cache.modify({
        fields: {
          Topics(existingTopicRefs = [], { readField }) {
            const newTopicRef = cache.writeFragment({
              data: newTopic,
              fragment: NEW_TOPIC_FRAGMENT,
            });

            if (
              existingTopicRefs.some(
                (topicRef: Reference) =>
                  readField("id", topicRef) === newTopic.id
              )
            ) {
              return existingTopicRefs;
            }

            return [...existingTopicRefs, newTopicRef];
          },
        },
      });
    },
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [autoFocus, setAutoFocus] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (data, actions) => {
      trackEvent({ eventName: AnalyticsEventNames.TopicCreate });
      setAutoFocus(true);
      createTopic({
        variables: {
          data: {
            ...data,
            name: prepareName(data.displayName),
            resource: { connect: { id: resourceId } },
          },
        },
      })
        .then((result) => {
          if (onTopicAdd) {
            onTopicAdd(result.data.createTopic);
          }
          addEntity(result.data.createTopic.id);
          actions.resetForm();
          inputRef.current?.focus();
        })
        .catch(console.error);
    },
    [createTopic, resourceId, onTopicAdd, addEntity, trackEvent]
  );

  const errorMessage = formatError(error);
  useEffect(() => {
    if (!error) return;

    trackEvent({ eventName: AnalyticsEventNames.TopicCreateFailed });
  }, [error]);

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: Partial<models.Topic>) =>
          validate(values, FORM_SCHEMA)
        }
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className={`${CLASS_NAME}__add-field`}>
            <TextField
              required
              name="displayName"
              label="New Topic Name"
              disabled={loading}
              inputRef={inputRef}
              placeholder="Add topic"
              autoComplete="off"
              autoFocus={autoFocus}
              hideLabel
              className={`${CLASS_NAME}__add-field__text`}
            />
            <Button
              buttonStyle={EnumButtonStyle.Text}
              icon="plus"
              className={classNames(`${CLASS_NAME}__add-field__button`, {
                [`${CLASS_NAME}__add-field__button--show`]: !isEmpty(
                  formik.values.displayName
                ),
              })}
            />
          </Form>
        )}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default NewTopic;

const CREATE_TOPIC = gql`
  mutation createTopic($data: TopicCreateInput!) {
    createTopic(data: $data) {
      id
      name
      displayName
      description
    }
  }
`;

const NEW_TOPIC_FRAGMENT = gql`
  fragment NewTopic on Topic {
    id
    name
    displayName
    description
  }
`;
