import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePlantationService } from '../services/create-plantation.service';
import { CreatePlantationDTO } from '../dtos/create-plantation.dto';
import { IPlantation } from '../entities/plantation.entity';

@Controller('plantations')
@ApiTags('plantations')
export class CreatePlantationController {
  constructor(
    private readonly createPlantationService: CreatePlantationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreatePlantationDTO) {
    const plantation: IPlantation =
      await this.createPlantationService.execute(data);

    return {
      status: true,
      statusCode: HttpStatus.CREATED,
      data: plantation,
    };
  }
}
