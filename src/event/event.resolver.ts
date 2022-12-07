import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { EventService } from './event.service'
import { CreateEventInput } from './models/create-event.input'
import { EventsInput } from './models/events.input'
import { Logger, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../lib/guards/jwt.guard'
import { CurrentUser } from '../lib/decorators/user.decorator'
import { User } from '../user/models/user.model'
import { Event } from '../event/models/event.model'
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub()

@Resolver(() => Event)
export class EventResolver {

  private readonly logger = new Logger('EventResolver')

  constructor(
    private readonly eventService: EventService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Event], { name: 'events'} )
  async events(
    @Args('params') params: EventsInput
  ) {
    this.logger.log(`Query.events - params: ${JSON.stringify(params)}`)
    return this.eventService.events(params)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Event, { name: 'createEvent' })
  async createEvent(
    @CurrentUser() user: User,
    @Args('params') params: CreateEventInput
  ) {
    this.logger.log(`Mutation.createEvent - user: ${JSON.stringify(user)}, params: ${JSON.stringify(params)}`)
    const event = await this.eventService.createEvent(user.id, params)
    await pubSub.publish('eventAdded', {
      eventAdded: event
    })
    return event
  }

  @Subscription(() => Event, {
    name: 'eventAdded'
  })
  subscribeToEventAdded() {
    this.logger.log(`Subscription.subscribeToEventAdded`)
    return pubSub.asyncIterator('eventAdded')
  }
}
