import { IProducer } from '@/modules/producers/entities/producer.entity';
import { InMemoryHarvestRepository } from '@/modules/harvests/tests/repositories/in-memory-harvest-repository';
import { InMemoryFarmRepository } from '@/modules/farms/tests/repositories/in-memory-farm-repository';
import { FindPlantationService } from '../find-plantation.service';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { IPlantation } from '../../entities/plantation.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { InMemoryPlantationsRepository } from '../../infra/db/in-memory/in-memory-plantations.repository';

let inMemoryPlantationRepository: InMemoryPlantationsRepository;
let inMemoryHarvestRepository: InMemoryHarvestRepository;
let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducersRepository;
let sut: FindPlantationService;
describe('FindPlantationService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryPlantationRepository = new InMemoryPlantationsRepository();
    inMemoryHarvestRepository = new InMemoryHarvestRepository();
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducersRepository();
    sut = new FindPlantationService(inMemoryPlantationRepository);
  });

  it('should return plantation successfully', async (): Promise<void> => {
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

    const result: IPlantation = await sut.execute(plantation.id);

    expect(result).toMatchObject({
      name: plantation.name,
      harvestId: plantation.harvestId,
    });
  });

  it('should throw an error if the plantation does not exist', async (): Promise<void> => {
    await expect(
      sut.execute('non-existent-plantation-id'),
    ).rejects.toHaveProperty('message', 'Plantation not found');
  });
});
