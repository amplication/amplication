/* eslint @typescript-eslint/naming-convention: 0 */
import { Injectable } from '@nestjs/common';
import { Client } from '@hubspot/api-client';
import { SimplePublicObjectWithAssociations, SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_TOKEN });

@Injectable()
export class HubSpotAnalyticsService {
  async addWorkspace(email: string, workspace: string): Promise<SimplePublicObject> {
    const contact = await this.getContact(email, ['workspace_id']);
    if (!contact) return;
    const workspaceSet = new Set(contact.properties?.workspace_id ? contact.properties.workspace_id.split(';') : []);
    workspaceSet.add(workspace);
    const workspaceArr = Array.from(workspaceSet);
    return hubspotClient.crm.contacts.basicApi.update(contact.id, {
      properties: {
        workspace_id: workspaceArr.join(';')
      }
    });
  }

  private getContact(contactId: string, properties: string[] = []): Promise<SimplePublicObjectWithAssociations> {
    return hubspotClient.crm.contacts.basicApi.getById(contactId, properties, null, null, null, 'email').catch(() => null);
  }

  async removeWorkspace(email: string, workspace: string): Promise<SimplePublicObject> {
    const contact = await this.getContact(email, ['workspace_id']);
    if (!contact) return;
    const workspaceSet = new Set(contact.properties?.workspace_id ? contact.properties.workspace_id.split(';') : []);
    workspaceSet.delete(workspace);
    const workspaceArr = Array.from(workspaceSet);
    return hubspotClient.crm.contacts.basicApi.update(contact.id, {
      properties: {
        workspace_id: workspaceArr.join(';')
      }
    });
  }
}
