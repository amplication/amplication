/* eslint @typescript-eslint/naming-convention: 0 */
import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { Client } from '@hubspot/api-client';
import {
  SimplePublicObjectWithAssociations,
  SimplePublicObject
} from '@hubspot/api-client/lib/codegen/crm/contacts';

const hubspotClient = new Client({
  defaultHeaders: { authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` }
});
const workspaceSeparator = '\n';
@Injectable()
export class HubSpotAnalyticsService {
  async addWorkspace(
    email: string,
    workspace: string
  ): Promise<SimplePublicObject> {
    const contact = await this.getContact(email, ['workspace_id']);
    if (!contact) return;
    const workspaceSet = new Set(
      contact.properties?.workspace_id
        ? contact.properties.workspace_id.split(workspaceSeparator)
        : []
    );
    workspaceSet.add(workspace);
    const workspaceArr = Array.from(workspaceSet);
    return hubspotClient.crm.contacts.basicApi.update(contact.id, {
      properties: {
        workspace_id: workspaceArr.join(workspaceSeparator)
      }
    });
  }

  private getContact(
    email: string,
    properties: string[] = []
  ): Promise<SimplePublicObjectWithAssociations> {
    return hubspotClient.crm.contacts.basicApi
      .getById(email, properties, undefined, undefined, undefined, 'email')
      .catch(() => null);
  }

  async removeWorkspace(
    email: string,
    workspace: string
  ): Promise<SimplePublicObject> {
    const contact = await this.getContact(email, ['workspace_id']);
    if (!contact) return;
    const workspaceSet = new Set(
      contact.properties?.workspace_id
        ? contact.properties.workspace_id.split(workspaceSeparator)
        : []
    );
    workspaceSet.delete(workspace);
    const workspaceArr = Array.from(workspaceSet);
    return hubspotClient.crm.contacts.basicApi.update(contact.id, {
      properties: {
        workspace_id: workspaceArr.join(workspaceSeparator)
      }
    });
  }
}
