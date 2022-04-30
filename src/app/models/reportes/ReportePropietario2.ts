import {ItemReportePropietario2} from './ItemReportePropietario2';

export class ReportePropietario2 {

  fechaHoraInicio: string;
  fechaHoraFin: string;
  items: ItemReportePropietario2[];
  granTotal: number;

  constructor(
    fechaHoraInicio: string,
    fechaHoraFin: string,
    items: ItemReportePropietario2[],
    granTotal: number
  )
  {
    this.fechaHoraInicio = fechaHoraInicio;
    this.fechaHoraFin = fechaHoraFin;
    this.items = items;
    this.granTotal = granTotal;
  }
}
