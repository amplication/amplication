import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleSecretsManagerService extends SecretManagerServiceClient {}
