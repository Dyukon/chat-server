import { Module } from '@nestjs/common'
import { EventService } from './event.service'
import { EventResolver } from './event.resolver'
import { PrismaService } from '../lib/services/prisma.service'

@Module({
  providers: [
    PrismaService,
    EventResolver,
    EventService
  ]
})
export class EventModule {
}
