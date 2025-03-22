import { IProducer } from '@/modules/producers/entities/producer.entity';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { InMemoryHarvestsRepository } from '../../infra/db/in-memory/in-memory-harvests-repository';
import { FindHarvestService } from '../find-harvest.service';
import { IHarvest } from '../../entities/harvest.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { InMemoryFarmsRepository } from '@/modules/farms/infra/db/in-memory/in-memory-farms-repository';

let inMemoryHarvestsRepository: InMemoryHarvestsRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: FindHarvestService;
describe('FindHarvestService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new FindHarvestService(inMemoryHarvestsRepository);
  });

  it('should return harvest successfully', async (): Promise<void> => {
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

    const harvest: IHarvest = await inMemoryHarvestsRepository.create({
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
