import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from '@nestjs/class-validator'

@InputType()
export class CreateUserInput {

  @Field()
  @IsEmail({}, {
    message: 'Email format is wrong'
  })
  email: string

  @Field()
  @IsNotEmpty({
    message: 'Name cannot be empty'
  })
  name: string

  @Field()
  @IsNotEmpty({
    message: 'Password cannot be empty'
  })
  password: string
}