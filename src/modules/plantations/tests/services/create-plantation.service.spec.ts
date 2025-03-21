import { InMemoryProducerRepository } from '@/modules/producers/tests/repositories/in-memory-producer-repository';
import { InMemoryPlantationRepository } from '../repositories/in-memory-plantation-repository';
import { IProducer } from '@/modules/producers/entities/producer.entity';
import { CreatePlantationService } from '../../services/create-plantation.service';
import { IPlantation } from '../../entities/plantation.entity';
import { InMemoryHarvestRepository } from '@/modules/harvests/tests/repositories/in-memory-harvest-repository';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { InMemoryFarmRepository } from '@/modules/farms/tests/repositories/in-memory-farm-repository';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { CreatePlantationDTO } from '../../dtos/create-plantation.dto';

let inMemoryPlantationRepository: InMemoryPlantationRepository;
let inMemoryHarvestRepository: InMemoryHarvestRepository;
let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: CreatePlantationService;
describe('CreatePlantationService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryPlantationRepository = new InMemoryPlantationRepository();
    inMemoryHarvestRepository = new InMemoryHarvestRepository();
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducerRepository();
    sut = new CreatePlantationService(inMemoryPlantationRepository);
  });

  it('should create a new plantation successfully', async (): Promise<void> => {
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

    const result: IPlantation = await sut.execute({
      name: 'Plantation A',
      harvestId: harvest.id,
    });

    expect(result.name).toBe('Plantation A');
    expect(result.harvestId).toBe(harvest.id);
    expect(inMemoryPlantationRepository.plantations.length).toBe(1);
    expect(inMemoryPlantationRepository.plantations[0]).toMatchObject(result);
  });

  it('should throw an error when creating a plantation with an existing name', async (): Promise<void> => {
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
