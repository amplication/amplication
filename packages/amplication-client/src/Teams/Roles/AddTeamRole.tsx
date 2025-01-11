import {
  Button,
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  List,
  ListItem,
  SearchField,
  Text,
} from "@amplication/ui/design-system";
import { useMemo, useState } from "react";
import * as models from "../../models";
import useRoles from "../../Roles/hooks/useRoles";

type Props = {
  team: models.Team;
  onAddRoles: (userIds: string[]) => void;
};

const CLASS_NAME = "add-team-role";

const AddTeamRole = ({ team, onAddRoles }: Props) => {
  const { findRolesData } = useRoles();

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleSelectRole = (userId: string) => {
    const checked = !selectedRoles.includes(userId);

    if (checked) {
      setSelectedRoles([...selectedRoles, userId]);
    } else {
      setSelectedRoles(selectedRoles.filter((id) => id !== userId));
    }
  };

  const handleAddRoles = () => {
    onAddRoles(selectedRoles);
  };

  const availableWorkspaceRolesFiltered = useMemo(() => {
    const unselectedRoles = findRolesData?.roles.filter(
      (role) => !team?.roles?.some((teamRole) => teamRole.id === role.id)
    );

    if (!searchPhrase) {
      return unselectedRoles;
    }

    const lowerSearchPhrase = searchPhrase.toLowerCase();

    return unselectedRoles.filter((role) =>
      role.name.toLowerCase().includes(lowerSearchPhrase)
    );
  }, [findRolesData?.roles, searchPhrase, team?.roles]);

  return (
    <>
      <FlexItem
        margin={EnumFlexItemMargin.Bottom}
        itemsAlign={EnumItemsAlign.Center}
        start={
          <SearchField
            label="search"
            placeholder="search"
            onChange={setSearchPhrase}
          />
        }
      ></FlexItem>
      <List className={CLASS_NAME}>
        {availableWorkspaceRolesFiltered?.map((role, index) => (
          <ListItem
            onClick={() => {
              handleSelectRole(role.id);
            }}
            key={index}
            start={
              <Icon
                icon={
                  selectedRoles.includes(role.id) ? "check_square" : "square"
                }
                color={
                  selectedRoles.includes(role.id)
                    ? EnumTextColor.ThemeGreen
                    : EnumTextColor.Black20
                }
              />
            }
          >
            {role.name}
          </ListItem>
        ))}
      </List>
      <FlexItem
        margin={EnumFlexItemMargin.Top}
        itemsAlign={EnumItemsAlign.Center}
        start={
          <Text textStyle={EnumTextStyle.Description}>
            {selectedRoles.length ? `${selectedRoles.length} selected` : ""}
          </Text>
        }
        end={
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            disabled={!selectedRoles.length}
            onClick={handleAddRoles}
          >
            Add Roles
          </Button>
        }
      ></FlexItem>
    </>
  );
};

export default AddTeamRole;
