import { SelectMenuItem } from "@amplication/ui/design-system";
import { commitStrategyOption } from "./Commit";
import { EnumCommitStrategy } from "../models";

type props = {
  item: commitStrategyOption;
  hasPendingChanges: boolean;
  onCommitStrategySelected: (itemSelected: EnumCommitStrategy) => void;
};

const CreateCommitStrategyButtonItem = ({
  item,
  hasPendingChanges,
  onCommitStrategySelected,
}: props) => {
  if (
    item.strategyType === EnumCommitStrategy.AllWithPendingChanges &&
    !hasPendingChanges
  )
    return null;

  return (
    <SelectMenuItem
      closeAfterSelectionChange
      as="span"
      itemData={item}
      onSelectionChange={(item: commitStrategyOption) => {
        onCommitStrategySelected(item.strategyType);
      }}
    >
      {item.label}
    </SelectMenuItem>
  );
};

export default CreateCommitStrategyButtonItem;
