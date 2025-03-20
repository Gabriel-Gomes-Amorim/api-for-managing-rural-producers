import { IProducer } from '@/modules/producers/entities/producer.entity';
import { InMemoryProducerRepository } from '@/modules/producers/tests/repositories/in-memory-producer-repository';
import { IListResponseRepository } from '@/core/repositories';
import { InMemoryHarvestRepository } from '@/modules/harvests/tests/repositories/in-memory-harvest-repository';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { ListAllHarvestsService } from '../../services/list-all-harvests.service';
import { InMemoryFarmRepository } from '@/modules/farms/tests/repositories/in-memory-farm-repository';
import { IFarm } from '@/modules/farms/entities/farm.entity';

let inMemoryHarvestRepository: InMemoryHarvestRepository;
let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: ListAllHarvestsService;

describe('ListAllHarvestService', (): void => {
  beforeEach((): void => {
    inMemoryHarvestRepository = new InMemoryHarvestRepository();
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducerRepository();
    sut = new ListAllHarvestsService(inMemoryHarvestRepository);
  });

  it('should list all harvest', async (): Promise<void> => {
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

    const harvest1: IHarvest = await inMemoryHarvestRepository.create({
      year: 2025,
      farmId: farm.id,
    });

    const harvest2: IHarvest = await inMemoryHarvestRepository.create({
      year: 2026,
      farmId: farm.id,
    });

    const result: IListResponseRepository<IHarvest> = await sut.execute({});

    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual([harvest1, harvest2]);
  });

  it('should filter harvests by name', async (): Promise<void> => {
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

    await inMemoryHarvestRepository.create({
      year: 2025,
      farmId: farm.id,
    });

    await inMemoryHarvestRepository.create({
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

    for (let i: number = 1; i <= 5; i++) {
      await inMemoryHarvestRepository.create({
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
