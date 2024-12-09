import "./GraphToolbar.scss";

import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
  SearchField,
  Tooltip,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import { Node } from "../../Blueprints/BlueprintsGraph/types";

export const CLASS_NAME = "graph-toolbar";

type Props = {
  nodes: Node[];
  searchPhraseChanged: (searchPhrase: string) => void;
};

export default function GraphToolbar({ nodes, searchPhraseChanged }: Props) {
  const handleSearchPhraseChanged = useCallback(
    (searchPhrase: string) => {
      searchPhraseChanged(searchPhrase);
    },
    [searchPhraseChanged]
  );

  return (
    <div className={CLASS_NAME}>
      <FlexItem
        itemsAlign={EnumItemsAlign.Center}
        contentAlign={EnumContentAlign.Start}
        gap={EnumGapSize.Large}
      >
        <FlexItem
          itemsAlign={EnumItemsAlign.Center}
          contentAlign={EnumContentAlign.Start}
          direction={EnumFlexDirection.Row}
        >
          <Tooltip
            aria-label="search for blueprints. Results are highlighted"
            noDelay
            direction="se"
          >
            <SearchField
              label=""
              placeholder="search"
              onChange={handleSearchPhraseChanged}
            />
          </Tooltip>
        </FlexItem>
      </FlexItem>
    </div>
  );
}
