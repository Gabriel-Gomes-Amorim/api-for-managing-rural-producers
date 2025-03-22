import { IProducer } from '@/modules/producers/entities/producer.entity';
import { IListResponseRepository } from '@/core/repositories';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { ListAllHarvestsService } from '../list-all-harvests.service';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { InMemoryHarvestsRepository } from '../../infra/db/in-memory/in-memory-harvests-repository';
import { InMemoryFarmsRepository } from '@/modules/farms/infra/db/in-memory/in-memory-farms-repository';

let inMemoryHarvestsRepository: InMemoryHarvestsRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: ListAllHarvestsService;

describe('ListAllHarvestService', (): void => {
  beforeEach((): void => {
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new ListAllHarvestsService(inMemoryHarvestsRepository);
  });

  it('should list all harvest', async (): Promise<void> => {
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

    const harvest1: IHarvest = await inMemoryHarvestsRepository.create({
      year: 2025,
      farmId: farm.id,
    });

    const harvest2: IHarvest = await inMemoryHarvestsRepository.create({
      year: 2026,
      farmId: farm.id,
    });

    const result: IListResponseRepository<IHarvest> = await sut.execute({});

    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual([harvest1, harvest2]);
  });

  it('should filter harvests by name', async (): Promise<void> => {
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

    await inMemoryHarvestsRepository.create({
      year: 2025,
      farmId: farm.id,
    });

    await inMemoryHarvestsRepository.create({
      year: 2026,
      farmId: farm.id,
    });

    const result: IListResponseRepository<IHarvest> = await sut.execute({
      year: 2026,
      skip: 0,
      take: 10,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].year).toBe(2026);
  });

  it('should paginate the results', async (): Promise<void> => {
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

    for (let i: number = 1; i <= 5; i++) {
      await inMemoryHarvestsRepository.create({
        year: 2025 + i,
        farmId: farm.id,
      });
    }

    const result: IListResponseRepository<IHarvest> = await sut.execute({
      skip: 2,
      take: 2,
    });

    expect(result.data).toHaveLength(2);
    expect(result.data[0].year).toBe(2028);
    expect(result.data[1].farmId).toBe(farm.id);
  });
});
