import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/infra/prisma/prisma.module';
import { CreateFarmController } from './controllers/create-farm.controller';
import { DeleteFarmController } from './controllers/delete-farm.controller';
import { FindFarmController } from './controllers/find-farm.controller';
import { ListFarmsController } from './controllers/list-all-farms.controller';
import { UpdateFarmController } from './controllers/update-farm.controller';
import { CreateFarmService } from './services/create-farm.service';
import { DeleteFarmService } from './services/delete-farm.service';
import { FindFarmService } from './services/find-farm.service';
import { ListAllFarmsService } from './services/list-all-farms.service';
import { UpdateFarmService } from './services/update-farm.service';
import { PrismaFarmsRepository } from './infra/db/prisma/prisma-farms.repository';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateFarmController,
    DeleteFarmController,
    FindFarmController,
    ListFarmsController,
    UpdateFarmController,
  ],
  providers: [
    CreateFarmService,
    DeleteFarmService,
    FindFarmService,
    ListAllFarmsService,
    UpdateFarmService,
    PrismaFarmsRepository,
    {
      provide: 'IFarmsRepository',
      useClass: PrismaFarmsRepository,
    },
  ],
  exports: [
    PrismaFarmsRepository,
    {
      provide: 'IFarmsRepository',
      useClass: PrismaFarmsRepository,
    },
  ],
})
export class FarmModule {}
