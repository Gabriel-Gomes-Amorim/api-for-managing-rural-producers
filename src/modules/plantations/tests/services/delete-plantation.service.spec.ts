import { InMemoryPlantationRepository } from '../repositories/in-memory-plantation-repository';
import { IProducer } from '@/modules/producers/entities/producer.entity';
import { DeletePlantationService } from '../../services/delete-plantation.service';
import { InMemoryHarvestRepository } from '@/modules/harvests/tests/repositories/in-memory-harvest-repository';
import { InMemoryFarmRepository } from '@/modules/farms/tests/repositories/in-memory-farm-repository';
import { IFarm } from '@/modules/farms/entities/farm.entity';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { IPlantation } from '../../entities/plantation.entity';
import { InMemoryProducersRepository } from '@/modules/producers/infra/db/in-memory/in-memory-producers.repository';

let inMemoryPlantationRepository: InMemoryPlantationRepository;
let inMemoryHarvestRepository: InMemoryHarvestRepository;
let inMemoryFarmRepository: InMemoryFarmRepository;
let inMemoryProducerRepository: InMemoryProducersRepository;
let sut: DeletePlantationService;
describe('DeletePlantationService', (): void => {
  beforeEach(async (): Promise<void> => {
    inMemoryPlantationRepository = new InMemoryPlantationRepository();
    inMemoryHarvestRepository = new InMemoryHarvestRepository();
    inMemoryFarmRepository = new InMemoryFarmRepository();
    inMemoryProducerRepository = new InMemoryProducersRepository();
    sut = new DeletePlantationService(inMemoryPlantationRepository);
  });

  it('should successfully delete plantation', async (): Promise<void> => {
    const producer: IProducer = await inMemoryProducerRepository.create({
      name: 'User Teste',
      cpfCnpj: '12345678900',
    });

    const farm: IFarm = await inMemoryFarmRepository.create({
      name: 'Farm A',
      city: 'City A',
      state: 'State A',
      totalArea: 1000,
      farmableArea: 800,
      vegetationArea: 200,
      producerId: producer.id,
    });

    const harvest: IHarvest = await inMemoryHarvestRepository.create({
      year: 2025,
      farmId: farm.id,
    });

    const plantation: IPlantation = await inMemoryPlantationRepository.create({
      name: 'Plantation A',
      harvestId: harvest.id,
    });

    await sut.execute(plantation.id);

    expect(inMemoryPlantationRepository.plantations).toHaveLength(0);
  });
});
