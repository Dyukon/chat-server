import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LoginUserResult {

  @Field()
  accessToken: string
}