import { IProducer } from '@/modules/producers/entities/producer.entity';
import { IFarm } from '../../entities/farm.entity';
import { FindFarmService } from '../../services/find-farm.service';
import { InMemoryFarmRepository } from '../repositories/in-memory-farm-repository';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';

let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducersRepository;
let sut: FindFarmService;
describe('FindFarmService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducersRepository();
    sut = new FindFarmService(inMemoryFarmRepository);
  });

  it('should return Farm successfully', async (): Promise<void> => {
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

    const result: IFarm = await sut.execute(farm.id);

    expect(result).toMatchObject({
      name: farm.name,
      producerId: farm.producerId,
    });
  });

  it('should throw an error if the Farm does not exist', async (): Promise<void> => {
    await expect(sut.execute('non-existent-Farm-id')).rejects.toHaveProperty(
      'message',
      'Farm not found',
    );
  });
});
