import { ListAllProducersService } from '../list-all-producers.service';
import { IProducer } from '../../entities/producer.entity';
import { IListResponseRepository } from '@/core/repositories';
import { InMemoryProducersRepository } from '../../infra/db/in-memory/in-memory-producers.repository';

let inMemoryProducersRepository: InMemoryProducersRepository;
let sut: ListAllProducersService;

describe('ListAllProducersService', (): void => {
  beforeEach((): void => {
    inMemoryProducersRepository = new InMemoryProducersRepository();
    sut = new ListAllProducersService(inMemoryProducersRepository);
  });

  it('should list all producers', async (): Promise<void> => {
    const producer1: IProducer = await inMemoryProducersRepository.create({
      name: 'User Test 1',
      cpfCnpj: '12345678900',
    });

    const producer2: IProducer = await inMemoryProducersRepository.create({
      name: 'User Test 2',
      cpfCnpj: '12345678999',
    });

    const result: IListResponseRepository<IProducer> = await sut.execute({});

    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual([producer1, producer2]);
  });

  it('should filter producers by name', async (): Promise<void> => {
    await inMemoryProducersRepository.create({
      name: 'John',
      cpfCnpj: '12345678900',
    });

    await inMemoryProducersRepository.create({
      name: 'User Test',
      cpfCnpj: '12345678999',
    });

    const result: IListResponseRepository<IProducer> = await sut.execute({
      name: 'John',
      skip: 0,
      take: 10,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('John');
  });

  it('should paginate the results', async (): Promise<void> => {
    for (let i: number = 1; i <= 5; i++) {
      await inMemoryProducersRepository.create({
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
