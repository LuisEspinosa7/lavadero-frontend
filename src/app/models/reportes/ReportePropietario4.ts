import {LiquidacionFuncionario} from '../LiquidacionFuncionario';

export class ReportePropietario4 {

  fechaHoraInicio: string;
  fechaHoraFin: string;
  items: LiquidacionFuncionario[];
  granTotal: number;

  constructor(
    fechaHoraInicio: string,
    fechaHoraFin: string,
    items: LiquidacionFuncionario[],
    granTotal: number
  )
  {
    this.fechaHoraInicio = fechaHoraInicio;
    this.fechaHoraFin = fechaHoraFin;
    this.items = items;
    this.granTotal = granTotal;
  }
}
