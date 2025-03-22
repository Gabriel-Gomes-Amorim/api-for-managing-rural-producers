import { InMemoryHarvestRepository } from '@/modules/harvests/tests/repositories/in-memory-harvest-repository';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { InMemoryFarmRepository } from '@/modules/farms/tests/repositories/in-memory-farm-repository';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { CreateHarvestService } from '../../services/create-harvest.service';
import { IProducer } from '@/modules/producers/entities/producer.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';

let inMemoryHarvestRepository: InMemoryHarvestRepository;
let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducersRepository;
let sut: CreateHarvestService;
describe('CreateHarvestService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryHarvestRepository = new InMemoryHarvestRepository();
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducersRepository();
    sut = new CreateHarvestService(inMemoryHarvestRepository);
  });

  it('should create a new harvest successfully', async (): Promise<void> => {
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

    const result: IHarvest = await sut.execute({
      year: 2025,
      farmId: farm.id,
    });

    expect(result.year).toBe(2025);
    expect(result.farmId).toBe(farm.id);
    expect(inMemoryHarvestRepository.harvests.length).toBe(1);
    expect(inMemoryHarvestRepository.harvests[0]).toMatchObject(result);
  });
});
