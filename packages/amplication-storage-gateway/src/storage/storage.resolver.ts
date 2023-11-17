import { Resolver } from "@nestjs/graphql";

@Resolver()
// IF THIS RESOLVER IS USED IN THE FUTURE, DO NOT FORGET TO ADD "@UseFilters(GqlResolverExceptionsFilter)"  and "@UseGuards(GqlAuthGuard)
export class StorageResolver {}
