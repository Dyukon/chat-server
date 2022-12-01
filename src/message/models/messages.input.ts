import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class MessagesInput {

  @Field({ nullable: true })
  senderId: string

  @Field({ nullable: true })
  receiverId: string

  @Field({ nullable: true })
  startDate: Date

  @Field({ nullable: true })
  finishDate: Date
}