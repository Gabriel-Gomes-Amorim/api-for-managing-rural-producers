import { IProducer } from '../../entities/producer.entity';
import { FindProducerService } from '../../services/find-producer.service';
import { InMemoryProducerRepository } from '../repositories/in-memory-producer-repository';

let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: FindProducerService;
describe('FindProducerService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryProducerRepository = new InMemoryProducerRepository();
    sut = new FindProducerService(inMemoryProducerRepository);
  });

  it('should return producer successfully', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducerRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    const result: IProducer = await sut.execute(producer.id);

    expect(result).toMatchObject({
      name: producer.name,
      cpfCnpj: producer.cpfCnpj,
    });
  });

  it('should throw an error if the producer does not exist', async (): Promise<void> => {
    await expect(
      sut.execute('non-existent-producer-id'),
    ).rejects.toHaveProperty('message', 'Producer not found');
  });
});
