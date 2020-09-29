import { Injectable } from '@nestjs/common';
import Docker from 'dockerode';

/** @todo move to another module */
@Injectable()
export class DockerService extends Docker {}
