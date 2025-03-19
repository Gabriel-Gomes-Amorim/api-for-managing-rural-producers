import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { ProducerModule } from './modules/producers/producer.module';
import { FarmModule } from './modules/farms/farm.module';
import { HarvestModule } from './modules/harvests/harvest.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    ProducerModule,
    FarmModule,
    HarvestModule,
  ],
})
export class AppModule {}
