import { Field, ObjectType } from '@nestjs/graphql'
import { User } from './user.model'

@ObjectType()
export class LoginUserResult {

  @Field()
  accessToken: string

  @Field(type => User)
  user: User
}