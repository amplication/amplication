import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum AppValidationErrorTypes {
  CannotMergeCodeToGitHubBreakingChanges = 'CannotMergeCodeToGitHubBreakingChanges',
  CannotMergeCodeToGitHubInvalidAppId = 'CannotMergeCodeToGitHubInvalidAppId',
  DataServiceGeneratorVersionMissing = 'DataServiceGeneratorVersionMissing',
  DataServiceGeneratorVersionInvalid = 'DataServiceGeneratorVersionInvalid'
}

registerEnumType(AppValidationErrorTypes, {
  name: 'AppValidationErrorTypes',
  description: undefined
});

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class AppValidationResult {
  @Field(() => Boolean)
  isValid: boolean;

  @Field(() => [AppValidationErrorTypes])
  messages: AppValidationErrorTypes[];
}
