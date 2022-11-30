import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateMessageInput {

  @Field()
  senderId: string

  @Field()
  receiverId: string

  @Field()
  text: string
}