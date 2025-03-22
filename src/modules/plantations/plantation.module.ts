import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/infra/prisma/prisma.module';
import { CreatePlantationController } from './controllers/create-plantation.controller';
import { DeletePlantationController } from './controllers/delete-plantation.controller';
import { FindPlantationController } from './controllers/find-plantation.controller';
import { ListPlantationsController } from './controllers/list-all-plantations.controller';
import { UpdatePlantationController } from './controllers/update-plantation.controller';
import { CreatePlantationService } from './services/create-plantation.service';
import { DeletePlantationService } from './services/delete-plantation.service';
import { FindPlantationService } from './services/find-plantation.service';
import { ListAllPlantationsService } from './services/list-all-plantations.service';
import { UpdatePlantationService } from './services/update-plantantion.service';
import { PrismaPlantationsRepository } from './infra/db/prisma/prisma-plantations.repository';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreatePlantationController,
    DeletePlantationController,
    FindPlantationController,
    ListPlantationsController,
    UpdatePlantationController,
  ],
  providers: [
    CreatePlantationService,
    DeletePlantationService,
    FindPlantationService,
    ListAllPlantationsService,
    UpdatePlantationService,
    PrismaPlantationsRepository,
    {
      provide: 'IPlantationsRepository',
      useClass: PrismaPlantationsRepository,
    },
  ],
})
export class PlantationModule {}
