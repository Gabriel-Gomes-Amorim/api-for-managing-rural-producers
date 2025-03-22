import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';
import { IFarm } from '../../entities/farm.entity';
import { DeleteFarmService } from '../delete-farm.service';
import { IProducer } from '@/modules/producers/entities/producer.entity';
import { InMemoryFarmsRepository } from '../../infra/db/in-memory/in-memory-farms-repository';

let inMemoryFarmsRepository: InMemoryFarmsRepository;
let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: DeleteFarmService;
describe('DeleteFarmService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryFarmsRepository = new InMemoryFarmsRepository();
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new DeleteFarmService(inMemoryFarmsRepository);
  });

  it('should successfully delete farm', async (): Promise<void> => {
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

    await sut.execute(farm.id);

    expect(inMemoryFarmsRepository.farms).toHaveLength(0);
  });
});
