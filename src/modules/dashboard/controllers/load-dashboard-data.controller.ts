import { Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoadDashboardDataService } from '../services/load-dashboard-data.service';
import { IGetFarmDashboardData } from '@/modules/farms/interfaces/IGetFarmDashboardData';

@Controller('dashboard')
@ApiTags('dashboard')
export class LoadDashboardDataController {
  constructor(
    private readonly loadDashboardDataService: LoadDashboardDataService,
  ) {}

  @Get()
  async create(@Res() res: Response): Promise<Response> {
    const dashboardData: IGetFarmDashboardData =
      await this.loadDashboardDataService.execute();

    return res.status(HttpStatus.OK).json({
      status: true,
      data: dashboardData,
    });
  }
}
