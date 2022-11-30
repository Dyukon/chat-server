import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class MessagesInput {

  @Field()
  senderId: string

  @Field()
  receiverId: string

  @Field()
  startDate: Date

  @Field()
  finishDate: Date
}