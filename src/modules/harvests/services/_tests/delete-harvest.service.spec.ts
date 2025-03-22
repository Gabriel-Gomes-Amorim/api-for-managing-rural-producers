import { IProducer } from '@/modules/producers/entities/producer.entity';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { DeleteHarvestService } from '../delete-harvest.service';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { InMemoryHarvestsRepository } from '../../infra/db/in-memory/in-memory-harvests-repository';
import { InMemoryFarmsRepository } from '@/modules/farms/infra/db/in-memory/in-memory-farms-repository';

let inMemoryHarvestsRepository: InMemoryHarvestsRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: DeleteHarvestService;
describe('DeleteHarvestService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new DeleteHarvestService(inMemoryHarvestsRepository);
  });

  it('should successfully delete harvest', async (): Promise<void> => {
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

    await sut.execute(harvest.id);

    expect(inMemoryHarvestsRepository.harvests).toHaveLength(0);
  });
});
