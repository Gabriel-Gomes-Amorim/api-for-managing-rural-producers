import { UpdateProducerService } from '../../services/update-producer.service';
import { InMemoryProducerRepository } from '../repositories/in-memory-producer-repository';
import { AppError } from '@/shared/errors/app-error';

let inMemoryProducerRepository: InMemoryProducerRepository;
let sut: UpdateProducerService;

describe('UpdateProducerService', () => {
  beforeEach(() => {
    inMemoryProducerRepository = new InMemoryProducerRepository();
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
