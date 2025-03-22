import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { CreateHarvestService } from '../create-harvest.service';
import { IProducer } from '@/modules/producers/entities/producer.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { InMemoryHarvestsRepository } from '../../infra/db/in-memory/in-memory-harvests-repository';
import { InMemoryFarmsRepository } from '@/modules/farms/infra/db/in-memory/in-memory-farms-repository';

let inMemoryHarvestsRepository: InMemoryHarvestsRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: CreateHarvestService;
describe('CreateHarvestService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new CreateHarvestService(inMemoryHarvestsRepository);
  });

  it('should create a new harvest successfully', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducersRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    const farm: IFarm = await inMemoryFarmsRepository.create({
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
    expect(inMemoryHarvestsRepository.harvests.length).toBe(1);
    expect(inMemoryHarvestsRepository.harvests[0]).toMatchObject(result);
  });
});
