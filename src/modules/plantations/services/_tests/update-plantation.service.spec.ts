import { IProducer } from '@/modules/producers/entities/producer.entity';
import { UpdatePlantationService } from '../update-plantantion.service';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { IPlantation } from '../../entities/plantation.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { InMemoryPlantationsRepository } from '../../infra/db/in-memory/in-memory-plantations.repository';
import { InMemoryHarvestsRepository } from '@/modules/harvests/infra/db/in-memory/in-memory-harvests-repository';
import { InMemoryFarmsRepository } from '@/modules/farms/infra/db/in-memory/in-memory-farms-repository';

let inMemoryPlantationsRepository: InMemoryPlantationsRepository;
let inMemoryHarvestsRepository: InMemoryHarvestsRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: UpdatePlantationService;

describe('UpdatePlantationService', (): void => {
  beforeEach((): void => {
    inMemoryPlantationsRepository = new InMemoryPlantationsRepository();
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new UpdatePlantationService(inMemoryPlantationsRepository);
  });

  it('should update an existing plantation', async (): Promise<void> => {
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

    const plantation: IPlantation = await inMemoryPlantationsRepository.create({
      name: 'Plantation A',
      harvestId: harvest.id,
    });

    const updatedPlantation: IPlantation = await sut.execute(
      { name: 'New Name' },
      plantation.id,
    );

    expect(updatedPlantation).toMatchObject({
      id: plantation.id,
      name: 'New Name',
      harvestId: harvest.id,
    });
  });

  it('should throw an error if the plantation does not exist', async (): Promise<void> => {
    await expect(
      sut.execute({ name: 'New Name' }, 'non-existing-id'),
    ).rejects.toHaveProperty('message', 'Plantation not found');
  });
});
