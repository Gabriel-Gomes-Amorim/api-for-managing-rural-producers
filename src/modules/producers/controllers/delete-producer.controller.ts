import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteProducerService } from '../services/delete-producer.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('producers')
@ApiTags('producers')
export class DeleteProducerController {
  constructor(private readonly deleteProducerService: DeleteProducerService) {}

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteProducerService.execute(id);
  }
}
