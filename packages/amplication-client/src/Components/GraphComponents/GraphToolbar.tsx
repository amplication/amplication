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

export const CLASS_NAME = "graph-toolbar";

type Props = {
  searchPhraseChanged: (searchPhrase: string) => void;
  children?: React.ReactNode;
};

export default function GraphToolbar({ searchPhraseChanged, children }: Props) {
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
        {children}
      </FlexItem>
    </div>
  );
}
