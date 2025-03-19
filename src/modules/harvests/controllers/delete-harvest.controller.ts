import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteHarvestService } from '../services/delete-harvest.service';

@Controller('harvests')
@ApiTags('harvests')
export class DeleteHarvestController {
  constructor(private readonly deleteHarvestService: DeleteHarvestService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteHarvestService.execute(id);
  }
}
