export interface IFarm {
  id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  farmableArea: number;
  vegetationArea: number;
  producerId: string;
  createdAt: Date;
  updatedAt: Date;
}
