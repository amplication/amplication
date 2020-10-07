import { Injectable } from '@nestjs/common';
import Docker from 'dockerode';
import { DockerProvider } from 'amplication-deployer/dist/docker';

@Injectable()
export class DockerProviderService {
  getProvider() {
    return new DockerProvider(new Docker());
  }
}
