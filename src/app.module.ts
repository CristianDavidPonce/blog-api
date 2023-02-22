import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module'
import { PermissionsModule } from './permissions/permissions.module'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'containers-us-west-80.railway.app',
      port: 5873,
      username: 'root',
      password: 'Du5cAVygRmBKoey5S1A0',
      database: 'railway',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    RolesModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
