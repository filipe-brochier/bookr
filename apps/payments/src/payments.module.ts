import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import z from 'zod';

const configSchema = z.object({
  PORT: z.number(),
  NOTIFICATIONS_HOST: z.string(),
  NOTIFICATIONS_PORT: z.number(),
  STRIPE_SECRET_KEY: z.string(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => configSchema.parse(config),
      envFilePath: 'apps/payments/.env',
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATIONS_HOST') as string,
            port: configService.get('NOTIFICATIONS_PORT') as number,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {
  /* */
}
