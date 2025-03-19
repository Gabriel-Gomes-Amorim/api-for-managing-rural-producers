import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeletePlantationService } from '../services/delete-plantation.service';

@Controller('plantations')
@ApiTags('plantations')
export class DeletePlantationController {
  constructor(
    private readonly deletePlantationService: DeletePlantationService,
  ) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deletePlantationService.execute(id);
  }
}
