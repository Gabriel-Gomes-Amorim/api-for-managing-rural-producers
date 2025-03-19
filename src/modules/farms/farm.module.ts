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
import { PrismaFarmRepository } from './infra/db/prisma/prisma-farm.repository';

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
    PrismaFarmRepository,
    {
      provide: 'IFarmsRepository',
      useClass: PrismaFarmRepository,
    },
  ],
})
export class FarmModule {}
