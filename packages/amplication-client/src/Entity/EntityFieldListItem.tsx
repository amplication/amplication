import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import * as models from "../models";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import { DeleteEntityField } from "./DeleteEntityField";
import "./EntityFieldListItem.scss";
import { EntityFieldProperty } from "./EntityFieldProperty";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "./constants";

type Props = {
  resourceId: string;
  entity: models.Entity;
  entityField: models.EntityField;
  entityIdToName: Record<string, string> | null;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

export const EntityFieldListItem = ({
  entityField,
  entity,
  resourceId,
  entityIdToName,
  onDelete,
  onError,
}: Props) => {
  const history = useHistory();
  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resourceId });

  const handleNavigateToRelatedEntity = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      history.push(
        `${baseUrl}/entities/${entityField.properties.relatedEntityId}`
      );
    },
    [history, entityField, baseUrl]
  );

  const handleRowClick = useCallback(() => {
    history.push(`${baseUrl}/entities/${entity.id}/fields/${entityField.id}`);
  }, [baseUrl, history, entityField, entity]);

  const fieldUrl = `${baseUrl}/entities/${entity.id}/fields/${entityField.id}`;

  return (
    <ListItem onClick={handleRowClick}>
      <FlexItem
        start={
          <FlexItem direction={EnumFlexDirection.Row}>
            <Icon
              className="amp-data-grid-item__icon"
              icon={DATA_TYPE_TO_LABEL_AND_ICON[entityField.dataType].icon}
              size="xsmall"
            />
            <Link title={entityField.displayName} to={fieldUrl}>
              <Text>{entityField.displayName}</Text>
            </Link>
            <Text textColor={EnumTextColor.ThemeTurquoise}>
              {entityField.name}
            </Text>
          </FlexItem>
        }
        end={
          <DeleteEntityField
            entityId={entity.id}
            entityField={entityField}
            onDelete={onDelete}
            onError={onError}
          />
        }
      />

      {!isEmpty(entityField.description) && (
        <Text textStyle={EnumTextStyle.Description}>
          {entityField.description}
        </Text>
      )}
      <FlexItem
        direction={EnumFlexDirection.Row}
        margin={EnumFlexItemMargin.Top}
      >
        {entityField.dataType === models.EnumDataType.Lookup &&
        entityIdToName ? (
          <Link
            title={DATA_TYPE_TO_LABEL_AND_ICON[entityField.dataType].label}
            to={`${baseUrl}/entities/${entityField.properties.relatedEntityId}`}
            onClick={handleNavigateToRelatedEntity}
          >
            {entityIdToName[entityField.properties.relatedEntityId]}{" "}
            <Icon icon="external_link" />
          </Link>
        ) : (
          <Text textStyle={EnumTextStyle.Tag}>
            {DATA_TYPE_TO_LABEL_AND_ICON[entityField.dataType].label}
          </Text>
        )}
        {entityField.required && (
          <EntityFieldProperty property="Required" icon="alert_triangle" />
        )}
        {entityField.unique && (
          <EntityFieldProperty property="Unique" icon="star" />
        )}
        {entityField.searchable && (
          <EntityFieldProperty property="Searchable" icon="search" />
        )}
      </FlexItem>
    </ListItem>
  );
};
