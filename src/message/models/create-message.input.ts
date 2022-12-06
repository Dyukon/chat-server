import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from '@nestjs/class-validator'

@InputType()
export class CreateMessageInput {

  @Field()
  @IsNotEmpty({
    message: 'Message cannot be empty'
  })
  text: string

  @Field({ nullable: true })
  receiverId: string
}