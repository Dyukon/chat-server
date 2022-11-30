import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateMessageInput {

  @Field()
  authorId: string

  @Field()
  receiverId: string

  @Field()
  text: string
}