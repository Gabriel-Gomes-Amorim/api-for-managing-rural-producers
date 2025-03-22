import { IProducer } from '@/modules/producers/entities/producer.entity';
import { IListResponseRepository } from '@/core/repositories';
import { ListAllPlantationsService } from '../list-all-plantations.service';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { IPlantation } from '../../entities/plantation.entity';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { InMemoryPlantationsRepository } from '../../infra/db/in-memory/in-memory-plantations.repository';
import { InMemoryHarvestsRepository } from '@/modules/harvests/infra/db/in-memory/in-memory-harvests-repository';
import { InMemoryFarmsRepository } from '@/modules/farms/infra/db/in-memory/in-memory-farms-repository';

let inMemoryPlantationsRepository: InMemoryPlantationsRepository;
let inMemoryHarvestsRepository: InMemoryHarvestsRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: ListAllPlantationsService;

describe('ListAllPlantationsService', (): void => {
  beforeEach((): void => {
    inMemoryPlantationsRepository = new InMemoryPlantationsRepository();
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new ListAllPlantationsService(inMemoryPlantationsRepository);
  });

  it('should list all plantation', async (): Promise<void> => {
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

    const plantation1: IPlantation = await inMemoryPlantationsRepository.create(
      {
        name: 'Plantation A',
        harvestId: harvest.id,
      },
    );

    const plantation2: IPlantation = await inMemoryPlantationsRepository.create(
      {
        name: 'Plantation B',
        harvestId: harvest.id,
      },
    );

    const result: IListResponseRepository<IPlantation> = await sut.execute({});

    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual([plantation1, plantation2]);
  });

  it('should filter plantations by name', async (): Promise<void> => {
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

    await inMemoryPlantationsRepository.create({
      name: `Coffee`,
      harvestId: harvest.id,
    });

    await inMemoryPlantationsRepository.create({
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

    for (let i: number = 1; i <= 5; i++) {
      await inMemoryPlantationsRepository.create({
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
