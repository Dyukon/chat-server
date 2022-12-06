import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Message {

  @Field(type => ID)
  id: string

  @Field()
  text: string

  @Field(type => Date)
  createdAt: Date

  @Field()
  senderId: string

  @Field()
  senderName: string

  @Field({ nullable: true })
  receiverId: string
}