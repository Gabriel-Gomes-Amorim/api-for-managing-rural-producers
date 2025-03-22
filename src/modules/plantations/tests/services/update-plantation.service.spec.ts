import { IProducer } from '@/modules/producers/entities/producer.entity';
import { InMemoryPlantationRepository } from '../repositories/in-memory-plantation-repository';
import { InMemoryHarvestRepository } from '@/modules/harvests/tests/repositories/in-memory-harvest-repository';
import { UpdatePlantationService } from '../../services/update-plantantion.service';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { InMemoryFarmRepository } from '@/modules/farms/tests/repositories/in-memory-farm-repository';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { IPlantation } from '../../entities/plantation.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';

let inMemoryPlantationRepository: InMemoryPlantationRepository;
let inMemoryHarvestRepository: InMemoryHarvestRepository;
let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducersRepository;
let sut: UpdatePlantationService;

describe('UpdatePlantationService', (): void => {
  beforeEach((): void => {
    inMemoryPlantationRepository = new InMemoryPlantationRepository();
    inMemoryHarvestRepository = new InMemoryHarvestRepository();
    inMemoryPlantationRepository = new InMemoryPlantationRepository();
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducersRepository();
    sut = new UpdatePlantationService(inMemoryPlantationRepository);
  });

  it('should update an existing plantation', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducerRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    const farm: IFarm = await inMemoryFarmRepository.create({
      name: 'Farm A',
      city: 'City A',
      state: 'State A',
      totalArea: 1000,
      farmableArea: 800,
      vegetationArea: 200,
      producerId: producer.id,
    });

    const harvest: IHarvest = await inMemoryHarvestRepository.create({
      year: 2025,
      farmId: farm.id,
    });

    const plantation: IPlantation = await inMemoryPlantationRepository.create({
      name: 'Plantation A',
      harvestId: harvest.id,
    });

    const updatedPlantation: IPlantation = await sut.execute(
      { name: 'New Name' },
      plantation.id,
    );

    expect(updatedPlantation).toMatchObject({
      id: plantation.id,
      name: 'New Name',
      harvestId: harvest.id,
    });
  });

  it('should throw an error if the plantation does not exist', async (): Promise<void> => {
    await expect(
      sut.execute({ name: 'New Name' }, 'non-existing-id'),
    ).rejects.toHaveProperty('message', 'Plantation not found');
  });
});
