import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { ProducerModule } from './modules/producers/producer.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, ProducerModule],
})
export class AppModule {}
