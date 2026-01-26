import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import z from 'zod';

const configSchema = z.object({
  MONGODB_URI: z.url(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRATION: z.string().regex(/^\d+$/).transform(Number),
  PORT: z.coerce.number(),
});

@Module({
  imports: [
    UsersModule,
    LoggerModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/reservations/.env',
      validate: (config) => configSchema.parse(config),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
  /* */
}
