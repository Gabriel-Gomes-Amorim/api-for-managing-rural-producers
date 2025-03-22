import { IProducer } from '@/modules/producers/entities/producer.entity';
import { CreatePlantationService } from '../create-plantation.service';
import { IPlantation } from '../../entities/plantation.entity';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { CreatePlantationDTO } from '../../dtos/create-plantation.dto';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { InMemoryPlantationsRepository } from '../../infra/db/in-memory/in-memory-plantations.repository';
import { InMemoryHarvestsRepository } from '@/modules/harvests/infra/db/in-memory/in-memory-harvests-repository';
import { InMemoryFarmsRepository } from '@/modules/farms/infra/db/in-memory/in-memory-farms-repository';

let inMemoryPlantationsRepository: InMemoryPlantationsRepository;
let inMemoryHarvestsRepository: InMemoryHarvestsRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: CreatePlantationService;
describe('CreatePlantationService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryPlantationsRepository = new InMemoryPlantationsRepository();
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new CreatePlantationService(inMemoryPlantationsRepository);
  });

  it('should create a new plantation successfully', async (): Promise<void> => {
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

    const result: IPlantation = await sut.execute({
      name: 'Plantation A',
      harvestId: harvest.id,
    });

    expect(result.name).toBe('Plantation A');
    expect(result.harvestId).toBe(harvest.id);
    expect(inMemoryPlantationsRepository.plantations.length).toBe(1);
    expect(inMemoryPlantationsRepository.plantations[0]).toMatchObject(result);
  });

  it('should throw an error when creating a plantation with an existing name', async (): Promise<void> => {
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

    const existingPlantation: CreatePlantationDTO = {
      name: 'Plantation A',
      harvestId: harvest.id,
    };

    await sut.execute(existingPlantation);

    await expect(sut.execute(existingPlantation)).rejects.toHaveProperty(
      'message',
      'Plantation already exists',
    );
  });
});
