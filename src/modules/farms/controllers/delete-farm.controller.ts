import { Controller, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteFarmService } from '../services/delete-farm.service';

@Controller('farms')
@ApiTags('farms')
export class DeleteFarmController {
  constructor(private readonly deleteFarmService: DeleteFarmService) {}

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteFarmService.execute(id);
  }
}
