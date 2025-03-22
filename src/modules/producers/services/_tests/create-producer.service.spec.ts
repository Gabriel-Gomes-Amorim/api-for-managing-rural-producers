import { CreateProducerService } from '../create-producer.service';
import { IProducer } from '../../entities/producer.entity';
import { CreateProducerDTO } from '../../dtos/create-producer.dto';
import { InMemoryProducersRepository } from '../../infra/db/in-memory/in-memory-producers.repository';

let inMemoryProducerRepository: InMemoryProducersRepository;
let sut: CreateProducerService;
describe('CreateProducerService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryProducerRepository = new InMemoryProducersRepository();
    sut = new CreateProducerService(inMemoryProducerRepository);
  });

  it('should create a new producer successfully', async (): Promise<void> => {
    const result: IProducer = await sut.execute({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    expect(result.name).toBe('User Teste');
    expect(result.cpfCnpj).toBe('12345678900');
    expect(inMemoryProducerRepository.producers.length).toBe(1);
    expect(inMemoryProducerRepository.producers[0]).toMatchObject(result);
  });

  it('should throw an error when creating a producer with an existing name or CPF/CNPJ', async (): Promise<void> => {
    const existingProducer: CreateProducerDTO = {
      name: 'User Teste',
      cpfCnpj: '12345678900',
    };

    await sut.execute(existingProducer);

    await expect(sut.execute(existingProducer)).rejects.toHaveProperty(
      'message',
      'Producer already exists',
    );
  });
});
