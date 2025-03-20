import { IProducer } from '@/modules/producers/entities/producer.entity';
import { IFarm } from '../../entities/farm.entity';
import { ListAllFarmsService } from '../../services/list-all-farms.service';
import { InMemoryFarmRepository } from '../repositories/in-memory-farm-repository';
import { InMemoryProducerRepository } from '@/modules/producers/tests/repositories/in-memory-producer-repository';
import { IListResponseRepository } from '@/core/repositories';

let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: ListAllFarmsService;

describe('ListAllFarmsService', (): void => {
  beforeEach((): void => {
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducerRepository();
    sut = new ListAllFarmsService(inMemoryFarmRepository);
  });

  it('should list all farms', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducerRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    const farm1: IFarm = await inMemoryFarmRepository.create({
      name: 'Farm A',
      city: 'City A',
      state: 'State A',
      totalArea: 1000,
      farmableArea: 800,
      vegetationArea: 200,
      producerId: producer.id,
    });

    const farm2: IFarm = await inMemoryFarmRepository.create({
      name: 'Farm B',
      city: 'City B',
      state: 'State B',
      totalArea: 1000,
      farmableArea: 800,
      vegetationArea: 200,
      producerId: producer.id,
    });

    const result: IListResponseRepository<IFarm> = await sut.execute({});

    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual([farm1, farm2]);
  });

  it('should filter farms by name', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducerRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    await inMemoryFarmRepository.create({
      name: 'Farm A',
      city: 'City A',
      state: 'State A',
      totalArea: 1000,
      farmableArea: 800,
      vegetationArea: 200,
      producerId: producer.id,
    });

    await inMemoryFarmRepository.create({
      name: 'Farm B',
      city: 'City B',
      state: 'State B',
      totalArea: 1000,
      farmableArea: 800,
      vegetationArea: 200,
      producerId: producer.id,
    });

    const result: IListResponseRepository<IFarm> = await sut.execute({
      name: 'Farm A',
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Farm A');
  });

  it('should paginate the results', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducerRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    for (let i: number = 1; i <= 5; i++) {
      await inMemoryFarmRepository.create({
        name: `Farm ${i}`,
        city: `City ${i}`,
        state: `State ${i}`,
        totalArea: 1000,
        farmableArea: 800,
        vegetationArea: 200,
        producerId: producer.id,
      });
    }

    const result: IListResponseRepository<IFarm> = await sut.execute({
      skip: 2,
      take: 2,
    });

    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe('Farm 3');
    expect(result.data[1].name).toBe('Farm 4');
  });
});
