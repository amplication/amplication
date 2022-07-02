import { Resolver } from '@nestjs/graphql';
import { Project } from 'src/models';

@Resolver(() => Project)
export class ProjectResolver {}
