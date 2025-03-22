import { InMemoryFarmsRepository } from '@/modules/farms/infra/db/in-memory/in-memory-farms-repository';
import { LoadDashboardDataService } from '../load-dashboard-data.service';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { IProducer } from '@/modules/producers/entities/producer.entity';
import { IGetFarmDashboardData } from '@/modules/farms/interfaces/IGetFarmDashboardData';

let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: LoadDashboardDataService;

describe('LoadDashboardDataService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new LoadDashboardDataService(inMemoryFarmsRepository);
  });

  it('should load dashboard data correctly', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducersRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    await inMemoryFarmsRepository.create({
      name: 'Farm A',
      city: 'City A',
      state: 'TO',
      totalArea: 1000,
      farmableArea: 800,
      vegetationArea: 200,
      producerId: producer.id,
    });

    await inMemoryFarmsRepository.create({
      name: 'Farm B',
      city: 'City B',
      state: 'GO',
      totalArea: 1000,
      farmableArea: 800,
      vegetationArea: 200,
      producerId: producer.id,
    });

    const result: IGetFarmDashboardData = await sut.execute();

    expect(result.totalFarms).toBe(2);
    expect(result.totalHectares).toBe(2000);
    expect(result.farmsByStateData).toEqual([
      { state: 'TO', count: 1 },
      { state: 'GO', count: 1 },
    ]);
    expect(result.landUsage).toEqual({
      farmableArea: 1600,
      vegetationArea: 400,
    });
    expect(result.plantationsData).toEqual([{ name: 'Soy', count: 2 }]);
  });
});
