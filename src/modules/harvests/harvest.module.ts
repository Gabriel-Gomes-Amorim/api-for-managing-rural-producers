import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/infra/prisma/prisma.module';
import { CreateHarvestController } from './controllers/create-harvest.controller';
import { DeleteHarvestController } from './controllers/delete-harvest.controller';
import { FindHarvestController } from './controllers/find-harvest.controller';
import { ListHarvestsController } from './controllers/list-all-harvests.controller';
import { UpdateHarvestController } from './controllers/update-harvest.controller';
import { CreateHarvestService } from './services/create-harvest.service';
import { DeleteHarvestService } from './services/delete-harvest.service';
import { FindHarvestService } from './services/find-harvest.service';
import { ListAllHarvestsService } from './services/list-all-harvests.service';
import { UpdateHarvestService } from './services/update-harvest.service';
import { PrismaHarvestsRepository } from './infra/db/prisma/prisma-harvests.repository';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateHarvestController,
    DeleteHarvestController,
    FindHarvestController,
    ListHarvestsController,
    UpdateHarvestController,
  ],
  providers: [
    CreateHarvestService,
    DeleteHarvestService,
    FindHarvestService,
    ListAllHarvestsService,
    UpdateHarvestService,
    PrismaHarvestsRepository,
    {
      provide: 'IHarvestsRepository',
      useClass: PrismaHarvestsRepository,
    },
  ],
})
export class HarvestModule {}
