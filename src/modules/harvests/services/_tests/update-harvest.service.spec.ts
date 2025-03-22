import { IProducer } from '@/modules/producers/entities/producer.entity';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { UpdateHarvestService } from '../update-harvest.service';
import { IHarvest } from '../../entities/harvest.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { InMemoryHarvestsRepository } from '../../infra/db/in-memory/in-memory-harvests-repository';
import { InMemoryFarmsRepository } from '@/modules/farms/infra/db/in-memory/in-memory-farms-repository';

let inMemoryHarvestsRepository: InMemoryHarvestsRepository;
let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: UpdateHarvestService;

describe('UpdateHarvestService', (): void => {
  beforeEach((): void => {
    inMemoryHarvestsRepository = new InMemoryHarvestsRepository();
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new UpdateHarvestService(inMemoryHarvestsRepository);
  });

  it('should update an existing harvest', async (): Promise<void> => {
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
