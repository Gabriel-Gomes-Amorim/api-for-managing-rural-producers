import { IProducer } from '@/modules/producers/entities/producer.entity';
import { InMemoryPlantationRepository } from '../repositories/in-memory-plantation-repository';
import { InMemoryProducerRepository } from '@/modules/producers/tests/repositories/in-memory-producer-repository';
import { IListResponseRepository } from '@/core/repositories';
import { InMemoryHarvestRepository } from '@/modules/harvests/tests/repositories/in-memory-harvest-repository';
import { InMemoryFarmRepository } from '@/modules/farms/tests/repositories/in-memory-farm-repository';
import { ListAllPlantationsService } from '../../services/list-all-plantations.service';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { IPlantation } from '../../entities/plantation.entity';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';

let inMemoryPlantationRepository: InMemoryPlantationRepository;
let inMemoryHarvestRepository: InMemoryHarvestRepository;
let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: ListAllPlantationsService;

describe('ListAllPlantationsService', (): void => {
  beforeEach((): void => {
    inMemoryPlantationRepository = new InMemoryPlantationRepository();
    inMemoryHarvestRepository = new InMemoryHarvestRepository();
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducerRepository();
    sut = new ListAllPlantationsService(inMemoryPlantationRepository);
  });

  it('should list all plantation', async (): Promise<void> => {
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

    const plantation1: IPlantation = await inMemoryPlantationRepository.create({
      name: 'Plantation A',
      harvestId: harvest.id,
    });

    const plantation2: IPlantation = await inMemoryPlantationRepository.create({
      name: 'Plantation B',
      harvestId: harvest.id,
    });

    const result: IListResponseRepository<IPlantation> = await sut.execute({});

    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual([plantation1, plantation2]);
  });

  it('should filter plantations by name', async (): Promise<void> => {
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

    await inMemoryPlantationRepository.create({
      name: `Coffee`,
      harvestId: harvest.id,
    });

    await inMemoryPlantationRepository.create({
      name: `Soy`,
      harvestId: harvest.id,
    });

    const result: IListResponseRepository<IPlantation> = await sut.execute({
      name: 'Coffee',
      skip: 0,
      take: 10,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Coffee');
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

    const harvest: IHarvest = await inMemoryHarvestRepository.create({
      year: 2025,
      farmId: farm.id,
    });

    for (let i: number = 1; i <= 5; i++) {
      await inMemoryPlantationRepository.create({
        name: `Plantation ${i}`,
        harvestId: harvest.id,
      });
    }

    const result: IListResponseRepository<IPlantation> = await sut.execute({
      skip: 2,
      take: 2,
    });

    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe('Plantation 3');
    expect(result.data[1].name).toBe('Plantation 4');
  });
});
