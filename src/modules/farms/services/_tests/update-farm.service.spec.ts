import { IProducer } from '@/modules/producers/entities/producer.entity';
import { UpdateFarmService } from '../update-farm.service';
import { IFarm } from '../../entities/farm.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { InMemoryFarmsRepository } from '../../infra/db/in-memory/in-memory-farms-repository';

let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: UpdateFarmService;

describe('UpdateFarmService', (): void => {
  beforeEach((): void => {
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new UpdateFarmService(inMemoryFarmsRepository);
  });

  it('should update an existing farm', async (): Promise<void> => {
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

    const updatedFarm: IFarm = await sut.execute({ name: 'New Name' }, farm.id);

    expect(updatedFarm).toMatchObject({
      id: farm.id,
      name: 'New Name',
      city: 'City A',
      state: 'State A',
      totalArea: 1000,
      farmableArea: 800,
      vegetationArea: 200,
      producerId: producer.id,
    });
  });

  it('should throw an error if the farm does not exist', async (): Promise<void> => {
    await expect(
      sut.execute({ name: 'New Name' }, 'non-existing-id'),
    ).rejects.toHaveProperty('message', 'Farm not found');
  });
});
