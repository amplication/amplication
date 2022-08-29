import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum ResourceValidationErrorTypes {
  CannotMergeCodeToGitHubBreakingChanges = 'CannotMergeCodeToGitHubBreakingChanges',
  CannotMergeCodeToGitHubInvalidResourceId = 'CannotMergeCodeToGitHubInvalidResourceId',
  DataServiceGeneratorVersionMissing = 'DataServiceGeneratorVersionMissing',
  DataServiceGeneratorVersionInvalid = 'DataServiceGeneratorVersionInvalid'
}

registerEnumType(ResourceValidationErrorTypes, {
  name: 'ResourceValidationErrorTypes'
});

@ObjectType({
  isAbstract: true
})
export class ResourceValidationResult {
  @Field(() => Boolean)
  isValid: boolean;

  @Field(() => [ResourceValidationErrorTypes])
  messages: ResourceValidationErrorTypes[];
}
