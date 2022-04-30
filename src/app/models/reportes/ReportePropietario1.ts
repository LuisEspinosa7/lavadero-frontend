import {ItemReportePropietario1} from './ItemReportePropietario1';

export class ReportePropietario1 {

  fechaHoraInicio: string;
  fechaHoraFin: string;
  items: ItemReportePropietario1[];
  granTotal: number;

  constructor(
    fechaHoraInicio: string,
    fechaHoraFin: string,
    items: ItemReportePropietario1[],
    granTotal: number
  )
  {
    this.fechaHoraInicio = fechaHoraInicio;
    this.fechaHoraFin = fechaHoraFin;
    this.items = items;
    this.granTotal = granTotal;
  }
}
