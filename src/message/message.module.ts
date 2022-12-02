import { Module } from '@nestjs/common'
import { MessageService } from './message.service'
import { MessageResolver } from './message.resolver'
import { PrismaService } from '../lib/services/prisma.service'

@Module({
  providers: [
    PrismaService,
    MessageResolver,
    MessageService
  ]
})
export class MessageModule {
}
