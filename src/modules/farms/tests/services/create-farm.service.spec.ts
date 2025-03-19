import { InMemoryProducerRepository } from '@/modules/producers/tests/repositories/in-memory-producer-repository';
import { IFarm } from '../../entities/farm.entity';
import { CreateFarmService } from '../../services/create-farm.service';
import { InMemoryFarmRepository } from '../repositories/in-memory-farm-repository';
import { IProducer } from '@/modules/producers/entities/producer.entity';
import { CreateFarmDTO } from '../../dtos/create-farm.dto';

let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: CreateFarmService;
describe('CreateFarmService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducerRepository();
    sut = new CreateFarmService(inMemoryFarmRepository);
  });

  it('should create a new Farm successfully', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducerRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    const result: IFarm = await sut.execute({
      name: 'Farm A',
      city: 'City A',
      state: 'State A',
      totalArea: 1000,
      farmableArea: 800,
      vegetationArea: 200,
      producerId: producer.id,
    });

    expect(result.name).toBe('Farm A');
    expect(result.producerId).toBe(producer.id);
    expect(inMemoryFarmRepository.farms.length).toBe(1);
    expect(inMemoryFarmRepository.farms[0]).toMatchObject(result);
  });

  it('should throw an error when creating a Farm with an existing name, state and city', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducerRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    const existingFarm: CreateFarmDTO = {
      name: 'Farm A',
      city: 'City A',
      state: 'State A',
      totalArea: 1000,
      farmableArea: 800,
      vegetationArea: 200,
      producerId: producer.id,
    };

    await sut.execute(existingFarm);

    await expect(sut.execute(existingFarm)).rejects.toHaveProperty(
      'message',
      'Farm already exists',
    );
  });

  it('should throw an error when farmableArea + vegetationArea exceeds totalArea', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducerRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    const invalidFarm: CreateFarmDTO = {
      name: 'Invalid Farm',
      city: 'City B',
      state: 'State B',
      totalArea: 1000,
      farmableArea: 600,
      vegetationArea: 500,
      producerId: producer.id,
    };

    await expect(sut.execute(invalidFarm)).rejects.toHaveProperty(
      'message',
      'The sum of farmable and vegetation areas cannot exceed the total area',
    );
  });
});
