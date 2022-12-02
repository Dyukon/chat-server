import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Message {

  @Field(type => ID)
  id: string

  @Field()
  text: string

  @Field()
  createdAt: Date

  @Field()
  senderId: string

  @Field({ nullable: true })
  receiverId: string
}