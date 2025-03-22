import { IProducer } from '@/modules/producers/entities/producer.entity';
import { UpdateFarmService } from '../../services/update-farm.service';
import { InMemoryFarmRepository } from '../repositories/in-memory-farm-repository';
import { IFarm } from '../../entities/farm.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';

let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducersRepository;
let sut: UpdateFarmService;

describe('UpdateFarmService', (): void => {
  beforeEach((): void => {
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducersRepository();
    sut = new UpdateFarmService(inMemoryFarmRepository);
  });

  it('should update an existing farm', async (): Promise<void> => {
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
