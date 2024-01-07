import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import {
  Button,
  Dialog,
  EnumButtonStyle,
  SearchField,
} from "@amplication/ui/design-system";
import { Node } from "./types";
import "./ModelGroupList.scss";
import { useCallback, useState } from "react";
import NewTempResource from "./NewTempResource";
import { Resource } from "../../models";

const CLASS_NAME = "model-group-list";

type Props = {
  modelGroups: Node[];
  selectedNode: Node;
  readOnly: boolean;
  handleModelGroupFilterChanged: (event: any, modelGroup: Node) => void;
  searchPhraseChanged: (searchPhrase: string) => void;
  handleServiceCreated: (newResource: Resource) => void;
};

export default function ModelsGroupsList({
  modelGroups,
  selectedNode,
  readOnly,
  handleModelGroupFilterChanged,
  searchPhraseChanged,
  handleServiceCreated,
}: Props) {
  const [newService, setNewService] = useState<boolean>(false);
  const handleNewServiceClick = useCallback(() => {
    setNewService(!newService);
  }, [newService, setNewService]);
  const handleSearchPhraseChanged = useCallback(
    (searchPhrase: string) => {
      searchPhraseChanged(searchPhrase);
    },
    [searchPhraseChanged]
  );

  const handleNewCreatedServiceClick = useCallback(
    (newResource: Resource) => {
      setNewService(!newService);
      handleServiceCreated(newResource);
    },
    [newService, handleServiceCreated, setNewService]
  );

  return (
    <>
      {readOnly && (
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchPhraseChanged}
        />
      )}
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__filter`}>
          {selectedNode && (
            <>
              <div className={`${CLASS_NAME}__selectedNode`}>
                <Button
                  key={selectedNode?.id}
                  icon="services"
                  iconSize="xsmall"
                  buttonStyle={EnumButtonStyle.Text}
                ></Button>
              </div>
              <hr className="amp-horizontal-rule amp-horizontal-rule--black5" />
            </>
          )}
          <p>Filter</p>
          {modelGroups.map((model) => (
            <div className={`${CLASS_NAME}__modelGroups`}>
              <Button
                key={model.id}
                icon="services"
                iconSize="xsmall"
                buttonStyle={EnumButtonStyle.Text}
                onClick={(event) => handleModelGroupFilterChanged(event, model)}
              ></Button>
            </div>
          ))}
        </div>
        <div className={`${CLASS_NAME}__filter`}>
          <p>Tools</p>
          <Button onClick={handleNewServiceClick}>+</Button>
          <Dialog
            isOpen={newService}
            onDismiss={handleNewServiceClick}
            title="New Service"
          >
            <NewTempResource
              onSuccess={handleNewCreatedServiceClick}
            ></NewTempResource>
          </Dialog>
        </div>
      </div>
    </>
  );
}
