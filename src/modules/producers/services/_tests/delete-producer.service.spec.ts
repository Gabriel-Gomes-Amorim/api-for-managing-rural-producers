import { IProducer } from '../../entities/producer.entity';
import { DeleteProducerService } from '../delete-producer.service';
import { InMemoryProducersRepository } from '../../infra/db/in-memory/in-memory-producers.repository';

let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: DeleteProducerService;
describe('DeleteProducerService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new DeleteProducerService(inMemoryProducersRepository);
  });

  it('should successfully delete producer', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducersRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    await sut.execute(producer.id);

    expect(inMemoryProducersRepository.producers).toHaveLength(0);
  });
});
