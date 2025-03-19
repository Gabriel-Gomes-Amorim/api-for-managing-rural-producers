import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePlantationService } from '../services/update-plantantion.service';
import { IPlantation } from '../entities/plantation.entity';
import { UpdatePlantationDTO } from '../dtos/update-plantation.dto';

@Controller('plantations')
@ApiTags('plantations')
export class UpdatePlantationController {
  constructor(
    private readonly updatePlantationService: UpdatePlantationService,
  ) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() data: UpdatePlantationDTO) {
    const plantation: IPlantation = await this.updatePlantationService.execute(
      data,
      id,
    );

    return {
      status: true,
      statusCode: HttpStatus.OK,
      data: plantation,
    };
  }
}
