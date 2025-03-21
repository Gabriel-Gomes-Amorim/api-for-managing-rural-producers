import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/infra/prisma/prisma.module';
import { ProducerModule } from './modules/producers/producer.module';
import { FarmModule } from './modules/farms/farm.module';
import { HarvestModule } from './modules/harvests/harvest.module';
import { PlantationModule } from './modules/plantations/plantation.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    ProducerModule,
    FarmModule,
    HarvestModule,
    PlantationModule,
    DashboardModule,
  ],
})
export class AppModule {}
