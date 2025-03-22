import { IProducer } from '@/modules/producers/entities/producer.entity';
import { IFarm } from '../../entities/farm.entity';
import { FindFarmService } from '../find-farm.service';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { InMemoryFarmsRepository } from '../../infra/db/in-memory/in-memory-farms-repository';

let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: FindFarmService;
describe('FindFarmService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new FindFarmService(inMemoryFarmsRepository);
  });

  it('should return Farm successfully', async (): Promise<void> => {
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
