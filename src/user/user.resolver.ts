import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserService } from './user.service'
import { ApolloError } from 'apollo-server-express'
import { CreateUserInput } from './models/create-user.input'
import { CreateUserResult } from './models/create-user.result'
import { LoginUserInput } from './models/login-user.input'
import { LoginUserFakeResult, LoginUserResult } from './models/login-user.result'
import { UseGuards, Request } from '@nestjs/common'
import { JwtAuthGuard } from '../lib/guards/jwt.guard'
import { CurrentUser } from '../lib/decorators/user.decorator'
import { User } from './models/user.model'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService
  ) {}

  @Mutation(() => CreateUserResult, {name: 'createUser'})
  async createUser(
    @Args('params') params: CreateUserInput
  ): Promise<CreateUserResult> {
    console.log(`Mutation.createUser - params: ${JSON.stringify(params)}`)

    const userByEmail = await this.userService.findByEmail(params.email)
    if (userByEmail) {
      throw new ApolloError('A user with that email already exists')
    }

    const userByName = await this.userService.findByName(params.name)
    if (userByName) {
      throw new ApolloError('A user with that name already exists')
    }

    const result = await this.userService.createUser(params)
    console.log(`Mutation.createUser - result: ${JSON.stringify(result)}`)
    return result;
  }

  @Mutation(() => LoginUserResult, {name: 'loginUser'})
  async loginUser(
    @Args('params') params: LoginUserInput
  ): Promise<LoginUserResult> {
    console.log(`Mutation.loginUser - params: ${JSON.stringify(params)}`)
    const result = await this.userService.loginUser(params)
    console.log(`Mutation.loginUser - result: ${JSON.stringify(result)}`)
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], {name: 'users'})
  async users(): Promise<User[]> {
    console.log(`Query.users`)
    return await this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], {name: 'receivers'})
  async receivers(
    @CurrentUser() user: User
  ): Promise<User[]> {
    console.log(`Query.addressees - user: ${JSON.stringify(user)}`)
    return await this.userService.findAllExcept(user.id)
  }
}
