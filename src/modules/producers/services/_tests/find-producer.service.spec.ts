import { IProducer } from '../../entities/producer.entity';
import { FindProducerService } from '../find-producer.service';
import { InMemoryProducersRepository } from '../../infra/db/in-memory/in-memory-producers.repository';

let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: FindProducerService;
describe('FindProducerService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new FindProducerService(inMemoryProducersRepository);
  });

  it('should return producer successfully', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducersRepository.create({
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
