import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserService } from './user.service'
import { CreateUserInput } from './graphql/models/create-user.input'
import { User } from '@prisma/client'
import { ApolloError } from 'apollo-server-express'
import { LoginUserInput } from './graphql/models/login-user.input'
import { LoginUserResult } from './graphql/models/login-user-result'
import { UseGuards, Request } from '@nestjs/common'
import { JwtAuthGuard } from '../lib/guards/jwt.guard'
import { CurrentUser } from '../lib/decorators/user.decorator'

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService
  ) {}

  @Mutation()
  async createUser(@Args('params') params: CreateUserInput): Promise<User> {
    console.log(`Mutation.createUser - params: ${JSON.stringify(params)}`)

    const userByEmail = await this.userService.findByEmail(params.email)
    if (userByEmail) {
      throw new ApolloError('A user with that email already exists')
    }

    const userByName = await this.userService.findByName(params.name)
    if (userByName) {
      throw new ApolloError('A user with that name already exists')
    }

    return await this.userService.createUser(params)
  }

  @Mutation()
  async loginUser(@Args('params') params: LoginUserInput): Promise<LoginUserResult> {
    console.log(`Mutation.loginUser - params: ${JSON.stringify(params)}`)

    return await this.userService.loginUser(params)
  }

  @UseGuards(JwtAuthGuard)
  @Query()
  async users(): Promise<User[]> {
    console.log(`Query.users`)
    return await this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Query()
  async receivers(@CurrentUser() user: User): Promise<User[]> {
    console.log(`Query.addressees - user: ${JSON.stringify(user)}`)
    return await this.userService.findAllExcept(user.id)
  }
}
