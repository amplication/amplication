import { Injectable } from '@nestjs/common';
import Docker from 'dockerode';

@Injectable()
export class DockerService extends Docker {}
