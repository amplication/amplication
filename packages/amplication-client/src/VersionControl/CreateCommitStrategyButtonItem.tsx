import {
  Button,
  EnumButtonStyle,
  SelectMenuItem,
} from "@amplication/ui/design-system";
import { commitStrategyOption } from "./Commit";
import { EnumCommitStrategy } from "../models";
import "./CreateCommitStrategyButtonItem.scss";

const CLASS_NAME = "create-commit-strategy-button-item";

type props = {
  item: commitStrategyOption;
  hasPendingChanges: boolean;
  onCommitStrategySelected: (itemSelected: commitStrategyOption) => void;
};

const CreateCommitStrategyButtonItem = ({
  item,
  hasPendingChanges,
  onCommitStrategySelected,
}: props) => {
  return (
    <SelectMenuItem
      closeAfterSelectionChange
      as="span"
      itemData={item.strategyType}
    >
      <Button
        disabled={
          item.strategyType === EnumCommitStrategy.AllWithPendingChanges &&
          !hasPendingChanges
        }
        name="commitStrategy"
        onClick={() => {
          onCommitStrategySelected(item);
        }}
        buttonStyle={EnumButtonStyle.Text}
      >
        <>{item.label} </>
      </Button>
    </SelectMenuItem>
  );
};

export default CreateCommitStrategyButtonItem;
