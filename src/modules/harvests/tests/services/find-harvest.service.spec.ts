import { IProducer } from '@/modules/producers/entities/producer.entity';
import { InMemoryProducerRepository } from '@/modules/producers/tests/repositories/in-memory-producer-repository';
import { InMemoryFarmRepository } from '@/modules/farms/tests/repositories/in-memory-farm-repository';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { InMemoryHarvestRepository } from '../repositories/in-memory-harvest-repository';
import { FindHarvestService } from '../../services/find-harvest.service';
import { IHarvest } from '../../entities/harvest.entity';

let inMemoryHarvestRepository: InMemoryHarvestRepository;
let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: FindHarvestService;
describe('FindHarvestService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryHarvestRepository = new InMemoryHarvestRepository();
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducerRepository();
    sut = new FindHarvestService(inMemoryHarvestRepository);
  });

  it('should return harvest successfully', async (): Promise<void> => {
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

    const result: IHarvest = await sut.execute(harvest.id);

    expect(result).toMatchObject({
      year: harvest.year,
      farmId: harvest.farmId,
    });
  });

  it('should throw an error if the harvest does not exist', async (): Promise<void> => {
    await expect(sut.execute('non-existent-Harvest-id')).rejects.toHaveProperty(
      'message',
      'Harvest not found',
    );
  });
});
