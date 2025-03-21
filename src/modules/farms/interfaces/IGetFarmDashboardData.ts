export interface IGetFarmDashboardData {
  totalFarms: number;
  totalHectares: number;
  farmsByStateData: { state: string; count: number }[];
}
