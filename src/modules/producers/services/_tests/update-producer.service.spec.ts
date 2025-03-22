import { UpdateProducerService } from '../update-producer.service';
import { InMemoryProducersRepository } from '../../infra/db/in-memory/in-memory-producers.repository';

let inMemoryProducerRepository: InMemoryProducersRepository;
let sut: UpdateProducerService;

describe('UpdateProducerService', () => {
  beforeEach(() => {
    inMemoryProducerRepository = new InMemoryProducersRepository();
    sut = new UpdateProducerService(inMemoryProducerRepository);
  });

  it('should update an existing producer', async () => {
    const producer = await inMemoryProducerRepository.create({
      name: 'Old Name',
      cpfCnpj: '12345678900',
    });

    const updatedProducer = await sut.execute(
      { name: 'New Name', cpfCnpj: '09876543211' },
      producer.id,
    );

    expect(updatedProducer).toMatchObject({
      id: producer.id,
      name: 'New Name',
      cpfCnpj: '09876543211',
    });
  });

  it('should throw an error if the producer does not exist', async (): Promise<void> => {
    await expect(
      sut.execute({ name: 'New Name' }, 'non-existing-id'),
    ).rejects.toHaveProperty('message', 'Producer not found');
  });
});
