import { IProducer } from '@/modules/producers/entities/producer.entity';
import { InMemoryProducerRepository } from '@/modules/producers/tests/repositories/in-memory-producer-repository';
import { InMemoryFarmRepository } from '@/modules/farms/tests/repositories/in-memory-farm-repository';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { InMemoryHarvestRepository } from '../repositories/in-memory-harvest-repository';
import { UpdateHarvestService } from '../../services/update-harvest.service';
import { IHarvest } from '../../entities/harvest.entity';

let inMemoryHarvestRepository: InMemoryHarvestRepository;
let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: UpdateHarvestService;

describe('UpdateHarvestService', (): void => {
  beforeEach((): void => {
    inMemoryHarvestRepository = new InMemoryHarvestRepository();
    inMemoryHarvestRepository = new InMemoryHarvestRepository();
    inMemoryHarvestRepository = new InMemoryHarvestRepository();
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducerRepository();
    sut = new UpdateHarvestService(inMemoryHarvestRepository);
  });

  it('should update an existing harvest', async (): Promise<void> => {
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

    const updatedHarvest: IHarvest = await sut.execute(
      { year: 2026 },
      harvest.id,
    );

    expect(updatedHarvest).toMatchObject({
      id: harvest.id,
      year: 2026,
      farmId: farm.id,
    });
  });

  it('should throw an error if the Harvest does not exist', async (): Promise<void> => {
    await expect(
      sut.execute({ year: 2025 }, 'non-existing-id'),
    ).rejects.toHaveProperty('message', 'Harvest not found');
  });
});
