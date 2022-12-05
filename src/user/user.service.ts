import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/services/prisma.service'
import { User } from '@prisma/client'
import { CreateUserInput } from './models/create-user.input'
import { compare, genSalt, hash } from 'bcryptjs'
import { LoginUserInput } from './models/login-user.input'
import { ApolloError } from 'apollo-server-express'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany()
  }

  async findAllExcept(excludedId: string): Promise<User[]> {
    return await this.prismaService.user.findMany({
      where: {
        NOT: {
          id: excludedId
        }
      }
    })
  }

  async findById(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id: id
      }
    })
  }

  async findByName(name: string) {
    return await this.prismaService.user.findFirst({
      where: {
        name: name
      }
    })
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findFirst({
      where: {
        email: email
      }
    })
  }

  async createUser(params: CreateUserInput) {
    const salt = await genSalt(10)
    const hashedPassword = await hash(params.password, salt)

    const user = await this.prismaService.user.create({
      data: {
        email: params.email,
        name: params.name,
        hashedPassword: hashedPassword
      }
    })

    const accessToken = await this.jwtService.signAsync({
      id: user.id
    })

    return {
      accessToken,
      user
    }
  }

  async loginUser(params: LoginUserInput) {
    const user = await this.findByEmail(params.email)
    if (!user) {
      throw new ApolloError('User not found')
    }

    const isRightPassword = await compare(params.password, user.hashedPassword)
    if (!isRightPassword) {
      throw new ApolloError('Invalid password')
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id
    })

    return {
      accessToken,
      user
    }
  }
}
