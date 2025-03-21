import { Module } from '@nestjs/common';
import { LoadDashboardDataController } from './controllers/load-dashboard-data.controller';
import { LoadDashboardDataService } from './services/load-dashboard-data.service';
import { FarmModule } from '../farms/farm.module';

@Module({
  imports: [FarmModule],
  controllers: [LoadDashboardDataController],
  providers: [LoadDashboardDataService],
})
export class DashboardModule {}
