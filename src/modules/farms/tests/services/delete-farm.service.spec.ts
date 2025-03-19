import { InMemoryProducerRepository } from '@/modules/producers/tests/repositories/in-memory-producer-repository';
import { IFarm } from '../../entities/farm.entity';
import { DeleteFarmService } from '../../services/delete-farm.service';
import { InMemoryFarmRepository } from '../repositories/in-memory-farm-repository';
import { IProducer } from '@/modules/producers/entities/producer.entity';

let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: DeleteFarmService;
describe('DeleteFarmService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducerRepository();
    sut = new DeleteFarmService(inMemoryFarmRepository);
  });

  it('should successfully delete farm', async (): Promise<void> => {
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

    await sut.execute(farm.id);

    expect(inMemoryFarmRepository.farms).toHaveLength(0);
  });
});
