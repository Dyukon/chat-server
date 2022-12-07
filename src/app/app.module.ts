import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { UserModule } from '../user/user.module';
import { join } from 'path'
import { EventModule } from '../event/event.module'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'generated/schema.gql'),
      sortSchema: true,
      installSubscriptionHandlers: true,
      cors: {
        origin: 'http://localhost:4000',
        credentials: true
      }
    }),
    UserModule,
    EventModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {
}
