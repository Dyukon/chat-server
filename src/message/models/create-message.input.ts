import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateMessageInput {

  @Field()
  text: string

  @Field({ nullable: true })
  receiverId: string
}