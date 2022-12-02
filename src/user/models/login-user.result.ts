import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LoginUserResult {

  @Field()
  accessToken: string
}

@ObjectType()
export class LoginUserFakeResult {

  @Field()
  test: string
}