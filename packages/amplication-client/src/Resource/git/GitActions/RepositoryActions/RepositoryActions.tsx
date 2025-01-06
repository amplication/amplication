import { EnumGitProvider } from "@amplication/code-gen-types";
import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  FlexItem,
  Icon,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { EnumGitOrganizationType, Resource } from "../../../../models";
import { GitOrganizationFromGitRepository } from "../../ResourceGitSettingsPage";
import ResourceGitSyncDetails from "./ResourceGitSyncDetails";
import { useResourceContext } from "../../../../context/resourceContext";
type Props = {
  onCreateRepository: () => void;
  onSelectRepository: () => void;
  currentResourceWithGitRepository: Resource;
  selectedGitOrganization: GitOrganizationFromGitRepository | null;
};

export default function RepositoryActions({
  onCreateRepository,
  onSelectRepository,
  currentResourceWithGitRepository,
  selectedGitOrganization,
}: Props) {
  const { gitRepository } = currentResourceWithGitRepository;

  const { permissions } = useResourceContext();
  const canCreateRepo = permissions.canPerformTask("git.repo.create");

  return (
    <Panel panelStyle={EnumPanelStyle.Bold}>
      {gitRepository ? (
        <ResourceGitSyncDetails
          resourceWithRepository={currentResourceWithGitRepository}
        />
      ) : (
        <>
          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            start={
              <Text textColor={EnumTextColor.ThemeRed}>
                <FlexItem
                  itemsAlign={EnumItemsAlign.Center}
                  direction={EnumFlexDirection.Row}
                  gap={EnumGapSize.Small}
                >
                  <Icon icon="info_circle" color={EnumTextColor.White} />
                  No repository was selected
                </FlexItem>
              </Text>
            }
            end={
              selectedGitOrganization && (
                <FlexItem>
                  <Button
                    buttonStyle={EnumButtonStyle.Outline}
                    onClick={onSelectRepository}
                  >
                    Select repository
                  </Button>

                  {canCreateRepo && (
                    <>
                      {selectedGitOrganization.type ===
                        EnumGitOrganizationType.Organization && (
                        <Button
                          type="button"
                          buttonStyle={EnumButtonStyle.Primary}
                          onClick={onCreateRepository}
                        >
                          Create repository
                        </Button>
                      )}
                      {selectedGitOrganization.type ===
                        EnumGitOrganizationType.User &&
                        selectedGitOrganization.provider ===
                          EnumGitProvider.Github && (
                          <a
                            href={`https://github.com/new?&owner=${selectedGitOrganization.name}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button
                              type="button"
                              buttonStyle={EnumButtonStyle.Primary}
                            >
                              Create repository
                            </Button>
                          </a>
                        )}
                    </>
                  )}
                </FlexItem>
              )
            }
          ></FlexItem>
        </>
      )}
    </Panel>
  );
}
