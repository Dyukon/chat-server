import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CreateUserResult {

  @Field()
  accessToken: string
}