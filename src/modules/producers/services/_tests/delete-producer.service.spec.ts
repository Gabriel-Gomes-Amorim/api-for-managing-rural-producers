import { IProducer } from '../../entities/producer.entity';
import { DeleteProducerService } from '../delete-producer.service';
import { InMemoryProducersRepository } from '../../infra/db/in-memory/in-memory-producers.repository';

let inMemoryProducerRepository: InMemoryProducersRepository;
let sut: DeleteProducerService;
describe('DeleteProducerService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryProducerRepository = new InMemoryProducersRepository();
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
