import {ItemReporteAdmin4} from './ItemReporteAdmin4';

export class ReporteAdmin4 {

  fechaHora: string;
  items: ItemReporteAdmin4[];
  granTotal: number;


  constructor(
    fechaHora: string,
    items: ItemReporteAdmin4[],
    granTotal: number
  )
  {
    this.fechaHora = fechaHora;
    this.items = items;
    this.granTotal = granTotal;
  }
}
