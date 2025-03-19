import { IProducer } from '../../entities/producer.entity';
import { DeleteProducerService } from '../../services/delete-producer.service';
import { InMemoryProducerRepository } from '../repositories/in-memory-producer-repository';

let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: DeleteProducerService;
describe('DeleteProducerService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryProducerRepository = new InMemoryProducerRepository();
    sut = new DeleteProducerService(inMemoryProducerRepository);
  });

  it('should successfully delete producer', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducerRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    await sut.execute(producer.id);

    expect(inMemoryProducerRepository.producers).toHaveLength(0);
  });
});
