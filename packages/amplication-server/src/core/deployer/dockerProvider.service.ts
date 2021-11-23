import { Injectable } from '@nestjs/common';
import { DockerProvider } from '@amplication/deployer/dist/docker';
import { DockerService } from '../docker/docker.service';

@Injectable()
export class DockerProviderService {
  constructor(private readonly docker: DockerService) {}
  getProvider(): DockerProvider {
    return new DockerProvider(this.docker);
  }
}
