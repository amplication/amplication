import { ObjectType } from 'type-graphql';
import PaginatedResponse from '../../common/pagination/pagination';
import { Post } from '../post';

@ObjectType()
export class PostConnection extends PaginatedResponse(Post) {}
