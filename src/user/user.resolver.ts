import { Query, Resolver } from '@nestjs/graphql'
import { UserService } from './user.service'

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService
  ) {}

  @Query()
  async users() {
    console.log(`Query.users`)
    return this.userService.findAll()
  }
}
