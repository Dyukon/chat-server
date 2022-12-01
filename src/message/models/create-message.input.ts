import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateMessageInput {

  @Field()
  receiverId: string

  @Field()
  text: string
}