import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { DateScalar } from '../graphql/scalars/date.scalar'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      typePaths: ['./**/*.graphql']
    }),
    UserModule,
    MessageModule
  ],
  controllers: [AppController],
  providers: [
    DateScalar,
    AppService
  ],
})
export class AppModule {
}
