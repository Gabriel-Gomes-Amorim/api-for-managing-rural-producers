export interface IGetFarmDashboardData {
  totalFarms: number;
  totalHectares: number;
  farmsByStateData: { state: string; count: number }[];
  plantationsData: { name: string; count: number }[];
  landUsage: {
    farmableArea: number;
    vegetationArea: number;
  };
}
