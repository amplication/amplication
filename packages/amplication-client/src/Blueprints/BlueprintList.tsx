import {
  CircularProgress,
  EnabledIndicator,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  SearchField,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import useBlueprints from "./hooks/useBlueprints";
import NewBlueprint from "./NewBlueprint";
import BlueprintName from "./BlueprintName";

const CLASS_NAME = "custom-property-list";

type Props = {
  selectFirst?: boolean;
};

export const BlueprintList = React.memo(({ selectFirst = false }: Props) => {
  const { currentWorkspace } = useAppContext();

  const baseUrl = `/${currentWorkspace?.id}`;

  const {
    setSearchPhrase,
    findBlueprintsData: data,
    findBlueprintsError: error,
    findBlueprintsLoading: loading,
  } = useBlueprints();

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );
  const history = useHistory();

  const errorMessage = formatError(error);

  const handleBlueprintChange = useCallback(
    (blueprint: models.Blueprint) => {
      const fieldUrl = `${baseUrl}/blueprints/${blueprint.id}`;
      history.push(fieldUrl);
    },
    [history, baseUrl]
  );

  useEffect(() => {
    if (selectFirst && data && !isEmpty(data.blueprints)) {
      const blueprint = data.blueprints[0];
      const fieldUrl = `${baseUrl}/blueprints/${blueprint.id}`;
      history.push(fieldUrl);
    }
  }, [data, selectFirst, history, baseUrl]);

  return (
    <div className={CLASS_NAME}>
      <FlexItem
        margin={EnumFlexItemMargin.Bottom}
        end={loading && <CircularProgress centerToParent />}
      >
        <Text textStyle={EnumTextStyle.Tag}>
          {data?.blueprints.length || "0"}{" "}
          {pluralize(data?.blueprints.length, "Blueprint", "Blueprints")}
        </Text>
      </FlexItem>
      {
        <NewBlueprint
          disabled={!data?.blueprints}
          onBlueprintAdd={handleBlueprintChange}
        />
      }
      <HorizontalRule />
      <SearchField
        label="search"
        placeholder="search"
        onChange={handleSearchChange}
      />

      <FlexItem
        margin={EnumFlexItemMargin.Top}
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Stretch}
        gap={EnumGapSize.None}
      >
        {data?.blueprints?.map((blueprint) => (
          <InnerTabLink
            to={`${baseUrl}/blueprints/${blueprint.id}`}
            key={blueprint.id}
          >
            <FlexItem
              itemsAlign={EnumItemsAlign.Center}
              end={<EnabledIndicator enabled={blueprint.enabled} />}
            >
              <BlueprintName blueprint={blueprint} />
            </FlexItem>
          </InnerTabLink>
        ))}
      </FlexItem>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
});
