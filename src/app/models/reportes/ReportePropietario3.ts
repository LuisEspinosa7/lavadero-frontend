import {ItemReportePropietario3} from './ItemReportePropietario3';

export class ReportePropietario3 {

  fechaHoraInicio: string;
  fechaHoraFin: string;
  items: ItemReportePropietario3[];
  granTotal: number;

  constructor(
    fechaHoraInicio: string,
    fechaHoraFin: string,
    items: ItemReportePropietario3[],
    granTotal: number
  )
  {
    this.fechaHoraInicio = fechaHoraInicio;
    this.fechaHoraFin = fechaHoraFin;
    this.items = items;
    this.granTotal = granTotal;
  }
}
