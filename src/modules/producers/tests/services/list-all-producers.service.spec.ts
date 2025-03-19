import { ListAllProducersService } from '../../services/list-all-producers.service';
import { InMemoryProducerRepository } from '../repositories/in-memory-producer-repository';
import { IProducer } from '../../entities/producer.entity';
import { IListResponseRepository } from '@/core/repositories';

let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: ListAllProducersService;

describe('ListAllProducersService', (): void => {
  beforeEach((): void => {
    inMemoryProducerRepository = new InMemoryProducerRepository();
    sut = new ListAllProducersService(inMemoryProducerRepository);
  });

  it('should list all producers', async (): Promise<void> => {
    const producer1: IProducer = await inMemoryProducerRepository.create({
      name: 'User Test 1',
      cpfCnpj: '12345678900',
    });

    const producer2: IProducer = await inMemoryProducerRepository.create({
      name: 'User Test 2',
      cpfCnpj: '12345678999',
    });

    const result: IListResponseRepository<IProducer> = await sut.execute({});

    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual([producer1, producer2]);
  });

  it('should filter producers by name', async (): Promise<void> => {
    await inMemoryProducerRepository.create({
      name: 'John',
      cpfCnpj: '12345678900',
    });

    await inMemoryProducerRepository.create({
      name: 'User Test',
      cpfCnpj: '12345678999',
    });

    const result: IListResponseRepository<IProducer> = await sut.execute({
      name: 'John',
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('John');
  });

  it('should paginate the results', async (): Promise<void> => {
    for (let i: number = 1; i <= 5; i++) {
      await inMemoryProducerRepository.create({
        name: `Producer ${i}`,
        cpfCnpj: `1234567899${i}`,
      });
    }

    const result: IListResponseRepository<IProducer> = await sut.execute({
      skip: 2,
      take: 2,
    });

    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe('Producer 3');
    expect(result.data[1].name).toBe('Producer 4');
  });
});
