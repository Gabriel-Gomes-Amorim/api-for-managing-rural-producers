import { Module } from '@nestjs/common';
import { CreateProducerController } from './controllers/create-producer.controller';
import { DeleteProducerController } from './controllers/delete-producer.controller';
import { FindProducerController } from './controllers/find-producer.controller';
import { UpdateProducerController } from './controllers/update-producer.controller';
import { CreateProducerService } from './services/create-producer.service';
import { DeleteProducerService } from './services/delete-producer.service';
import { FindProducerService } from './services/find-producer.service';
import { UpdateProducerService } from './services/update-producer.service';
import { PrismaProducerRepository } from './infra/db/prisma/prisma-producer.repository';
import { PrismaModule } from 'src/shared/infra/prisma/prisma.module';
import { ListAllProducersService } from './services/list-all-producers.service';
import { ListProducersController } from './controllers/list-all-producers.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateProducerController,
    DeleteProducerController,
    FindProducerController,
    ListProducersController,
    UpdateProducerController,
  ],
  providers: [
    CreateProducerService,
    DeleteProducerService,
    FindProducerService,
    ListAllProducersService,
    UpdateProducerService,
    PrismaProducerRepository,
    {
      provide: 'IProducersRepository',
      useClass: PrismaProducerRepository,
    },
  ],
})
export class ProducerModule {}
