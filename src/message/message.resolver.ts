import { Resolver } from '@nestjs/graphql';
import { MessageService } from './message.service';

@Resolver('Message')
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}
}
